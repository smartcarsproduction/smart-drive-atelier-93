import { Router } from 'express';
import { UserService } from '../../src/lib/db-services';
import { z } from 'zod';
import { 
  authenticateToken, 
  requireAdmin, 
  requireCustomerOrAdmin,
  AuthenticatedRequest 
} from '../middleware/auth';
import { 
  PasswordUtils, 
  TokenUtils, 
  AuthResponse, 
  SecurityUtils 
} from '../utils/auth';

const router = Router();

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  picture: z.string().optional(),
  role: z.enum(['customer', 'admin', 'technician']).default('customer'),
  preferences: z.record(z.any()).optional(),
});

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(8).max(128),
});

const updateUserSchema = createUserSchema.partial();

// === AUTHENTICATION ENDPOINTS ===

// Register new user
router.post('/register', async (req, res) => {
  try {
    const userData = registerSchema.parse(req.body);
    
    // Check rate limiting
    const rateLimit = SecurityUtils.checkRateLimit(req.ip || 'unknown', 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Too many registration attempts',
        resetTime: new Date(rateLimit.resetTime).toISOString()
      });
    }

    // Validate password strength
    const passwordValidation = PasswordUtils.validatePasswordStrength(userData.password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Password does not meet security requirements',
        requirements: passwordValidation.errors
      });
    }

    // Create user with hashed password
    const user = await UserService.createWithPassword(userData);
    const sanitizedUser = UserService.sanitizeUser(user);
    
    // Generate authentication response with tokens
    const authResponse = AuthResponse.success(sanitizedUser);
    
    res.status(201).json(authResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    // Check rate limiting
    const rateLimit = SecurityUtils.checkRateLimit(`login_${req.ip || 'unknown'}_${email}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Too many login attempts',
        resetTime: new Date(rateLimit.resetTime).toISOString()
      });
    }

    // Authenticate user
    const user = await UserService.authenticateWithPassword(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Clear rate limit on successful login
    SecurityUtils.clearRateLimit(`login_${req.ip || 'unknown'}_${email}`);
    
    const sanitizedUser = UserService.sanitizeUser(user);
    const authResponse = AuthResponse.success(sanitizedUser);
    
    res.json(authResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google OAuth login
router.post('/google-auth', async (req, res) => {
  try {
    const { email, name, picture } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Check rate limiting for OAuth endpoint
    const rateLimit = SecurityUtils.checkRateLimit(`oauth_${req.ip || 'unknown'}`, 10, 10 * 60 * 1000); // 10 attempts per 10 minutes
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Too many OAuth attempts',
        resetTime: new Date(rateLimit.resetTime).toISOString()
      });
    }

    const user = await UserService.getOrCreateFromGoogle({ email, name, picture });
    const sanitizedUser = UserService.sanitizeUser(user);
    const authResponse = AuthResponse.success(sanitizedUser);
    
    // Clear rate limit on successful OAuth
    SecurityUtils.clearRateLimit(`oauth_${req.ip || 'unknown'}`);
    
    res.json(authResponse);
  } catch (error) {
    console.error('Error with Google OAuth:', error);
    res.status(500).json({ error: 'Failed to process Google OAuth' });
  }
});

// Refresh token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Check rate limiting for refresh token endpoint
    const rateLimit = SecurityUtils.checkRateLimit(`refresh_${req.ip || 'unknown'}`, 10, 5 * 60 * 1000); // 10 attempts per 5 minutes
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Too many refresh token attempts',
        resetTime: new Date(rateLimit.resetTime).toISOString()
      });
    }

    const decoded = TokenUtils.verifyToken(refreshToken);
    
    // Validate that this is actually a refresh token
    if (!decoded.type || decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid refresh token type' });
    }

    // Check if the refresh token is not too old (additional security)
    if (decoded.iat) {
      const tokenAge = Date.now() / 1000 - decoded.iat;
      if (tokenAge > 7 * 24 * 60 * 60) { // 7 days
        return res.status(401).json({ error: 'Refresh token expired' });
      }
    }

    const user = await UserService.findById(decoded.sub as string);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    // Clear rate limit on successful refresh
    SecurityUtils.clearRateLimit(`refresh_${req.ip || 'unknown'}`);

    const sanitizedUser = UserService.sanitizeUser(user);
    const authResponse = AuthResponse.success(sanitizedUser);
    
    res.json(authResponse);
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// === PROTECTED ENDPOINTS ===

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await UserService.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const sanitizedUser = UserService.sanitizeUser(user);
    res.json(sanitizedUser);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);
    
    // Validate new password strength
    const passwordValidation = PasswordUtils.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Password does not meet security requirements',
        requirements: passwordValidation.errors
      });
    }

    await UserService.updatePassword(req.user!.id, oldPassword, newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    
    if (error instanceof Error && error.message.includes('incorrect')) {
      return res.status(400).json({ error: error.message });
    }
    
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get all customers (admin only)
router.get('/customers', requireAdmin, async (req, res) => {
  try {
    const customers = await UserService.getAllCustomers();
    const sanitizedCustomers = customers.map(UserService.sanitizeUser);
    res.json(sanitizedCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get user by ID (admin only)
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await UserService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const sanitizedUser = UserService.sanitizeUser(user);
    res.json(sanitizedUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user by email (admin only)
router.get('/email/:email', requireAdmin, async (req, res) => {
  try {
    const user = await UserService.findByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const sanitizedUser = UserService.sanitizeUser(user);
    res.json(sanitizedUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create user (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const userData = createUserSchema.parse(req.body);
    const user = await UserService.create(userData);
    const sanitizedUser = UserService.sanitizeUser(user);
    res.status(201).json(sanitizedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user (admin or own profile)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Users can only update their own profile, admins can update any profile
    if (req.user!.role !== 'admin' && req.user!.id !== req.params.id) {
      return res.status(403).json({ error: 'Cannot update other user\'s profile' });
    }

    const updates = updateUserSchema.parse(req.body);
    
    // Non-admins cannot change their role
    if (req.user!.role !== 'admin' && updates.role) {
      delete updates.role;
    }

    const user = await UserService.update(req.params.id, updates);
    const sanitizedUser = UserService.sanitizeUser(user);
    res.json(sanitizedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Deactivate user (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await UserService.deactivateUser(req.params.id);
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});

// Reactivate user (admin only)
router.put('/:id/reactivate', requireAdmin, async (req, res) => {
  try {
    await UserService.reactivateUser(req.params.id);
    res.json({ message: 'User reactivated successfully' });
  } catch (error) {
    console.error('Error reactivating user:', error);
    res.status(500).json({ error: 'Failed to reactivate user' });
  }
});

export { router as userRoutes };