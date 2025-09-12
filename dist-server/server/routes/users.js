"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const db_services_1 = require("../../src/lib/db-services");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../utils/auth");
const router = (0, express_1.Router)();
exports.userRoutes = router;
// Validation schemas
const createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1),
    phone: zod_1.z.string().optional(),
    picture: zod_1.z.string().optional(),
    role: zod_1.z.enum(['customer', 'admin', 'technician']).default('customer'),
    preferences: zod_1.z.record(zod_1.z.any()).optional(),
});
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1),
    phone: zod_1.z.string().optional(),
    password: zod_1.z.string().min(8).max(128),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
const changePasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z.string(),
    newPassword: zod_1.z.string().min(8).max(128),
});
const updateUserSchema = createUserSchema.partial();
// === AUTHENTICATION ENDPOINTS ===
// Register new user
router.post('/register', async (req, res) => {
    try {
        const userData = registerSchema.parse(req.body);
        // Check rate limiting
        const rateLimit = auth_2.SecurityUtils.checkRateLimit(req.ip || 'unknown', 5, 15 * 60 * 1000);
        if (!rateLimit.allowed) {
            return res.status(429).json({
                error: 'Too many registration attempts',
                resetTime: new Date(rateLimit.resetTime).toISOString()
            });
        }
        // Validate password strength
        const passwordValidation = auth_2.PasswordUtils.validatePasswordStrength(userData.password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                error: 'Password does not meet security requirements',
                requirements: passwordValidation.errors
            });
        }
        // Create user with hashed password
        const user = await db_services_1.UserService.createWithPassword(userData);
        const sanitizedUser = db_services_1.UserService.sanitizeUser(user);
        // Generate authentication response with tokens
        const authResponse = auth_2.AuthResponse.success(sanitizedUser);
        res.status(201).json(authResponse);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
        const rateLimit = auth_2.SecurityUtils.checkRateLimit(`login_${req.ip || 'unknown'}_${email}`, 5, 15 * 60 * 1000);
        if (!rateLimit.allowed) {
            return res.status(429).json({
                error: 'Too many login attempts',
                resetTime: new Date(rateLimit.resetTime).toISOString()
            });
        }
        // Authenticate user
        const user = await db_services_1.UserService.authenticateWithPassword(email, password);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Clear rate limit on successful login
        auth_2.SecurityUtils.clearRateLimit(`login_${req.ip || 'unknown'}_${email}`);
        const sanitizedUser = db_services_1.UserService.sanitizeUser(user);
        const authResponse = auth_2.AuthResponse.success(sanitizedUser);
        res.json(authResponse);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
        const rateLimit = auth_2.SecurityUtils.checkRateLimit(`oauth_${req.ip || 'unknown'}`, 10, 10 * 60 * 1000); // 10 attempts per 10 minutes
        if (!rateLimit.allowed) {
            return res.status(429).json({
                error: 'Too many OAuth attempts',
                resetTime: new Date(rateLimit.resetTime).toISOString()
            });
        }
        const user = await db_services_1.UserService.getOrCreateFromGoogle({ email, name, picture });
        const sanitizedUser = db_services_1.UserService.sanitizeUser(user);
        const authResponse = auth_2.AuthResponse.success(sanitizedUser);
        // Clear rate limit on successful OAuth
        auth_2.SecurityUtils.clearRateLimit(`oauth_${req.ip || 'unknown'}`);
        res.json(authResponse);
    }
    catch (error) {
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
        const rateLimit = auth_2.SecurityUtils.checkRateLimit(`refresh_${req.ip || 'unknown'}`, 10, 5 * 60 * 1000); // 10 attempts per 5 minutes
        if (!rateLimit.allowed) {
            return res.status(429).json({
                error: 'Too many refresh token attempts',
                resetTime: new Date(rateLimit.resetTime).toISOString()
            });
        }
        const decoded = auth_2.TokenUtils.verifyToken(refreshToken);
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
        const user = await db_services_1.UserService.findById(decoded.sub);
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'User not found or inactive' });
        }
        // Clear rate limit on successful refresh
        auth_2.SecurityUtils.clearRateLimit(`refresh_${req.ip || 'unknown'}`);
        const sanitizedUser = db_services_1.UserService.sanitizeUser(user);
        const authResponse = auth_2.AuthResponse.success(sanitizedUser);
        res.json(authResponse);
    }
    catch (error) {
        console.error('Error refreshing token:', error);
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});
// === PROTECTED ENDPOINTS ===
// Get current user profile
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = await db_services_1.UserService.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const sanitizedUser = db_services_1.UserService.sanitizeUser(user);
        res.json(sanitizedUser);
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});
// Change password
router.put('/change-password', auth_1.authenticateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);
        // Validate new password strength
        const passwordValidation = auth_2.PasswordUtils.validatePasswordStrength(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                error: 'Password does not meet security requirements',
                requirements: passwordValidation.errors
            });
        }
        await db_services_1.UserService.updatePassword(req.user.id, oldPassword, newPassword);
        res.json({ message: 'Password changed successfully' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
router.get('/customers', auth_1.requireAdmin, async (req, res) => {
    try {
        const customers = await db_services_1.UserService.getAllCustomers();
        const sanitizedCustomers = customers.map(db_services_1.UserService.sanitizeUser);
        res.json(sanitizedCustomers);
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});
// Get user by ID (admin only)
router.get('/:id', auth_1.requireAdmin, async (req, res) => {
    try {
        const user = await db_services_1.UserService.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const sanitizedUser = db_services_1.UserService.sanitizeUser(user);
        res.json(sanitizedUser);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
// Get user by email (admin only)
router.get('/email/:email', auth_1.requireAdmin, async (req, res) => {
    try {
        const user = await db_services_1.UserService.findByEmail(req.params.email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const sanitizedUser = db_services_1.UserService.sanitizeUser(user);
        res.json(sanitizedUser);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
// Create user (admin only)
router.post('/', auth_1.requireAdmin, async (req, res) => {
    try {
        const userData = createUserSchema.parse(req.body);
        const user = await db_services_1.UserService.create(userData);
        const sanitizedUser = db_services_1.UserService.sanitizeUser(user);
        res.status(201).json(sanitizedUser);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});
// Update user (admin or own profile)
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        // Users can only update their own profile, admins can update any profile
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ error: 'Cannot update other user\'s profile' });
        }
        const updates = updateUserSchema.parse(req.body);
        // Non-admins cannot change their role
        if (req.user.role !== 'admin' && updates.role) {
            delete updates.role;
        }
        const user = await db_services_1.UserService.update(req.params.id, updates);
        const sanitizedUser = db_services_1.UserService.sanitizeUser(user);
        res.json(sanitizedUser);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});
// Deactivate user (admin only)
router.delete('/:id', auth_1.requireAdmin, async (req, res) => {
    try {
        await db_services_1.UserService.deactivateUser(req.params.id);
        res.json({ message: 'User deactivated successfully' });
    }
    catch (error) {
        console.error('Error deactivating user:', error);
        res.status(500).json({ error: 'Failed to deactivate user' });
    }
});
// Reactivate user (admin only)
router.put('/:id/reactivate', auth_1.requireAdmin, async (req, res) => {
    try {
        await db_services_1.UserService.reactivateUser(req.params.id);
        res.json({ message: 'User reactivated successfully' });
    }
    catch (error) {
        console.error('Error reactivating user:', error);
        res.status(500).json({ error: 'Failed to reactivate user' });
    }
});
