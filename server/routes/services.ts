import { Router } from 'express';
import { ServiceService } from '../../src/lib/db-services';
import { z } from 'zod';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Validation schemas
const createServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(['maintenance', 'detailing', 'diagnostics', 'customization']),
  price: z.string().optional(), // Decimal as string
  estimatedDuration: z.number().int().min(1).optional(),
  requiresPickup: z.boolean().default(false),
  luxuryLevel: z.enum(['standard', 'premium', 'elite']).default('standard'),
});

const updateServiceSchema = createServiceSchema.partial();

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await ServiceService.getAll();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get services by category
router.get('/category/:category', async (req, res) => {
  try {
    const services = await ServiceService.getByCategory(req.params.category);
    res.json(services);
  } catch (error) {
    console.error('Error fetching services by category:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await ServiceService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Create service (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const serviceData = createServiceSchema.parse(req.body);
    const service = await ServiceService.create(serviceData);
    res.status(201).json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update service (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const updates = updateServiceSchema.parse(req.body);
    const service = await ServiceService.update(req.params.id, updates);
    res.json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

export { router as serviceRoutes };