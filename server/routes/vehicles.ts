import { Router } from 'express';
import { VehicleService } from '../../src/lib/db-services';
import { z } from 'zod';
import { 
  authenticateToken, 
  requireAdmin,
  AuthenticatedRequest 
} from '../middleware/auth';

const router = Router();

// Validation schemas
const createVehicleSchema = z.object({
  userId: z.string().uuid(),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  vin: z.string().optional(),
  color: z.string().optional(),
  mileage: z.number().int().min(0).optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  engineSize: z.string().optional(),
  notes: z.string().optional(),
});

const updateVehicleSchema = createVehicleSchema.partial().omit({ userId: true });

// Get vehicles by user ID (authenticated users only - can access own vehicles, admins can access any)
router.get('/user/:userId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Users can only access their own vehicles, admins can access any
    if (req.user!.role !== 'admin' && req.user!.id !== req.params.userId) {
      return res.status(403).json({ error: 'Cannot access other user\'s vehicles' });
    }

    const vehicles = await VehicleService.findByUserId(req.params.userId);
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Get current user's vehicles
router.get('/my-vehicles', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const vehicles = await VehicleService.findByUserId(req.user!.id);
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching user vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Get vehicle by ID (owner or admin only)
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const vehicle = await VehicleService.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Users can only access their own vehicles, admins can access any
    if (req.user!.role !== 'admin' && req.user!.id !== vehicle.userId) {
      return res.status(403).json({ error: 'Cannot access other user\'s vehicle' });
    }

    res.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// Create vehicle (authenticated users can create for themselves, admins can create for anyone)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const vehicleData = createVehicleSchema.parse(req.body);
    
    // If not admin, force userId to be the authenticated user
    if (req.user!.role !== 'admin') {
      vehicleData.userId = req.user!.id;
    }
    
    // Validate userId matches authenticated user or user is admin
    if (req.user!.role !== 'admin' && vehicleData.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Cannot create vehicle for other users' });
    }

    const vehicle = await VehicleService.create(vehicleData);
    res.status(201).json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error creating vehicle:', error);
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

// Update vehicle (owner or admin only)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // First get the vehicle to check ownership
    const existingVehicle = await VehicleService.findById(req.params.id);
    if (!existingVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Users can only update their own vehicles, admins can update any
    if (req.user!.role !== 'admin' && req.user!.id !== existingVehicle.userId) {
      return res.status(403).json({ error: 'Cannot update other user\'s vehicle' });
    }

    const updates = updateVehicleSchema.parse(req.body);
    const vehicle = await VehicleService.update(req.params.id, updates);
    res.json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error updating vehicle:', error);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

// Delete vehicle (owner or admin only)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // First get the vehicle to check ownership
    const existingVehicle = await VehicleService.findById(req.params.id);
    if (!existingVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Users can only delete their own vehicles, admins can delete any
    if (req.user!.role !== 'admin' && req.user!.id !== existingVehicle.userId) {
      return res.status(403).json({ error: 'Cannot delete other user\'s vehicle' });
    }

    await VehicleService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

export { router as vehicleRoutes };