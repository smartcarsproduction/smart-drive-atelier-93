import { Router } from 'express';
import { UserService } from '../../src/lib/db-services';
import { z } from 'zod';

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

const updateUserSchema = createUserSchema.partial();

// Get all customers (admin only)
router.get('/customers', async (req, res) => {
  try {
    const customers = await UserService.getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await UserService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user by email
router.get('/email/:email', async (req, res) => {
  try {
    const user = await UserService.findByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const userData = createUserSchema.parse(req.body);
    const user = await UserService.create(userData);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const updates = updateUserSchema.parse(req.body);
    const user = await UserService.update(req.params.id, updates);
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Google OAuth integration
router.post('/google', async (req, res) => {
  try {
    const { email, name, picture } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const user = await UserService.getOrCreateFromGoogle({ email, name, picture });
    res.json(user);
  } catch (error) {
    console.error('Error with Google OAuth:', error);
    res.status(500).json({ error: 'Failed to process Google OAuth' });
  }
});

export { router as userRoutes };