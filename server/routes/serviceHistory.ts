import { Router } from 'express';
import { ServiceHistoryService } from '../../src/lib/db-services';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createServiceHistorySchema = z.object({
  bookingId: z.string().uuid(),
  userId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  serviceId: z.string().uuid(),
  completedDate: z.string().datetime(),
  rating: z.number().int().min(1).max(5).optional(),
  review: z.string().optional(),
  totalPrice: z.string().optional(), // Decimal as string
  technicianId: z.string().uuid().optional(),
});

// Get service history for user
router.get('/user/:userId', async (req, res) => {
  try {
    const history = await ServiceHistoryService.getForUser(req.params.userId);
    res.json(history);
  } catch (error) {
    console.error('Error fetching service history:', error);
    res.status(500).json({ error: 'Failed to fetch service history' });
  }
});

// Get service history for vehicle
router.get('/vehicle/:vehicleId', async (req, res) => {
  try {
    const history = await ServiceHistoryService.getForVehicle(req.params.vehicleId);
    res.json(history);
  } catch (error) {
    console.error('Error fetching vehicle service history:', error);
    res.status(500).json({ error: 'Failed to fetch service history' });
  }
});

// Create service history record
router.post('/', async (req, res) => {
  try {
    const historyData = createServiceHistorySchema.parse({
      ...req.body,
      completedDate: new Date(req.body.completedDate).toISOString(),
    });
    
    const history = await ServiceHistoryService.create({
      ...historyData,
      completedDate: new Date(historyData.completedDate),
    });
    
    res.status(201).json(history);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error creating service history:', error);
    res.status(500).json({ error: 'Failed to create service history' });
  }
});

export { router as serviceHistoryRoutes };