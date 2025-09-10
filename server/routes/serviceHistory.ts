import { Router } from 'express';
import { ServiceHistoryService } from '../../src/lib/db-services';
import { z } from 'zod';
import { 
  authenticateToken, 
  requireAdmin,
  AuthenticatedRequest 
} from '../middleware/auth';

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

// Get service history for user (own history or admin)
router.get('/user/:userId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Users can only access their own history, admins can access any
    if (req.user!.role !== 'admin' && req.user!.id !== req.params.userId) {
      return res.status(403).json({ error: 'Cannot access other user\'s service history' });
    }

    const history = await ServiceHistoryService.getForUser(req.params.userId);
    res.json(history);
  } catch (error) {
    console.error('Error fetching service history:', error);
    res.status(500).json({ error: 'Failed to fetch service history' });
  }
});

// Get current user's service history
router.get('/my-history', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const history = await ServiceHistoryService.getForUser(req.user!.id);
    res.json(history);
  } catch (error) {
    console.error('Error fetching service history:', error);
    res.status(500).json({ error: 'Failed to fetch service history' });
  }
});

// Get service history for vehicle (vehicle owner or admin)
router.get('/vehicle/:vehicleId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Note: Should check vehicle ownership here for non-admin users
    // For now, allowing authenticated users - in production would need vehicle ownership check
    const history = await ServiceHistoryService.getForVehicle(req.params.vehicleId);
    res.json(history);
  } catch (error) {
    console.error('Error fetching vehicle service history:', error);
    res.status(500).json({ error: 'Failed to fetch service history' });
  }
});

// Create service history record (admin or technician only)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Only admin or technician can create service history records
    if (!['admin', 'technician'].includes(req.user!.role)) {
      return res.status(403).json({ error: 'Insufficient permissions to create service history' });
    }

    const historyData = createServiceHistorySchema.parse({
      ...req.body,
      completedDate: new Date(req.body.completedDate).toISOString(),
    });
    
    const history = await ServiceHistoryService.create({
      ...historyData,
      completedDate: new Date(historyData.completedDate),
      technicianId: historyData.technicianId || req.user!.id, // Default to current user if not specified
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