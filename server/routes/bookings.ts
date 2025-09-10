import { Router } from 'express';
import { BookingService } from '../../src/lib/db-services';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createBookingSchema = z.object({
  userId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  serviceId: z.string().uuid(),
  scheduledDate: z.string().datetime(),
  estimatedCompletion: z.string().datetime().optional(),
  totalPrice: z.string().optional(), // Decimal as string
  notes: z.string().optional(),
  pickupAddress: z.string().optional(),
  deliveryAddress: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

const updateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
  technicianNotes: z.string().optional(),
});

// Get all bookings (admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await BookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get bookings by status
router.get('/status/:status', async (req, res) => {
  try {
    const bookings = await BookingService.getBookingsByStatus(req.params.status);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings by status:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get bookings by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await BookingService.findByUserId(req.params.userId);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await BookingService.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const bookingData = createBookingSchema.parse({
      ...req.body,
      scheduledDate: new Date(req.body.scheduledDate).toISOString(),
      estimatedCompletion: req.body.estimatedCompletion 
        ? new Date(req.body.estimatedCompletion).toISOString() 
        : undefined,
    });
    
    const booking = await BookingService.create({
      ...bookingData,
      scheduledDate: new Date(bookingData.scheduledDate),
      estimatedCompletion: bookingData.estimatedCompletion 
        ? new Date(bookingData.estimatedCompletion) 
        : undefined,
    });
    
    res.status(201).json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, technicianNotes } = updateBookingStatusSchema.parse(req.body);
    const booking = await BookingService.updateStatus(req.params.id, status, technicianNotes);
    res.json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

export { router as bookingRoutes };