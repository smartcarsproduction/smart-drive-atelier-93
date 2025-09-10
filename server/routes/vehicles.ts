import { Router } from 'express';
import { VehicleService } from '../../src/lib/db-services';
import { z } from 'zod';

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

// Get vehicles by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const vehicles = await VehicleService.findByUserId(req.params.userId);
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Get vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await VehicleService.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// Create vehicle
router.post('/', async (req, res) => {
  try {
    const vehicleData = createVehicleSchema.parse(req.body);
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

// Update vehicle
router.put('/:id', async (req, res) => {
  try {
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

// Delete vehicle (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await VehicleService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

export { router as vehicleRoutes };