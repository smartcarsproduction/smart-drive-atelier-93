import { Router } from 'express';
import { BookingService } from '../../src/lib/db-services';
import { z } from 'zod';
import { 
  authenticateToken, 
  requireAdmin,
  AuthenticatedRequest 
} from '../middleware/auth';
import { makeCompletionVoiceCall } from '../utils/twilio';

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

// Get all bookings (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const bookings = await BookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get bookings by status (admin only)
router.get('/status/:status', requireAdmin, async (req, res) => {
  try {
    const bookings = await BookingService.getBookingsByStatus(req.params.status);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings by status:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get bookings by user ID (authenticated users - own bookings or admin)
router.get('/user/:userId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Users can only access their own bookings, admins can access any
    if (req.user!.role !== 'admin' && req.user!.id !== req.params.userId) {
      return res.status(403).json({ error: 'Cannot access other user\'s bookings' });
    }

    const bookings = await BookingService.findByUserId(req.params.userId);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get current user's bookings
router.get('/my-bookings', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const bookings = await BookingService.findByUserId(req.user!.id);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get bookings by vehicle ID (vehicle owner or admin only)
router.get('/vehicle/:vehicleId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Check vehicle ownership first (if not admin)
    if (req.user!.role !== 'admin') {
      const { VehicleService } = await import('../../src/lib/db-services');
      const vehicle = await VehicleService.findById(req.params.vehicleId);
      
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      
      if (vehicle.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Cannot access other user\'s vehicle bookings' });
      }
    }
    
    const bookings = await BookingService.findByVehicleId(req.params.vehicleId);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching vehicle bookings:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle bookings' });
  }
});

// Get upcoming bookings by vehicle ID (vehicle owner or admin only) 
router.get('/vehicle/:vehicleId/upcoming', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Check vehicle ownership first (if not admin)
    if (req.user!.role !== 'admin') {
      const { VehicleService } = await import('../../src/lib/db-services');
      const vehicle = await VehicleService.findById(req.params.vehicleId);
      
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      
      if (vehicle.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Cannot access other user\'s vehicle bookings' });
      }
    }
    
    const bookings = await BookingService.getUpcomingBookingsForVehicle(req.params.vehicleId);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching upcoming vehicle bookings:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming vehicle bookings' });
  }
});

// Get booking by ID (owner or admin only)
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const booking = await BookingService.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Users can only access their own bookings, admins can access any
    if (req.user!.role !== 'admin' && req.user!.id !== booking.userId) {
      return res.status(403).json({ error: 'Cannot access other user\'s booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Create booking (authenticated users can create for themselves, admins can create for anyone)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const bookingData = createBookingSchema.parse({
      ...req.body,
      scheduledDate: new Date(req.body.scheduledDate).toISOString(),
      estimatedCompletion: req.body.estimatedCompletion 
        ? new Date(req.body.estimatedCompletion).toISOString() 
        : undefined,
    });
    
    // If not admin, force userId to be the authenticated user
    if (req.user!.role !== 'admin') {
      bookingData.userId = req.user!.id;
    }
    
    // Validate userId matches authenticated user or user is admin
    if (req.user!.role !== 'admin' && bookingData.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Cannot create booking for other users' });
    }
    
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

// Update booking status (admin or technician only)
router.patch('/:id/status', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Only admin or technician can update booking status
    if (!['admin', 'technician'].includes(req.user!.role)) {
      return res.status(403).json({ error: 'Insufficient permissions to update booking status' });
    }

    const { status, technicianNotes } = updateBookingStatusSchema.parse(req.body);
    
    // Get the current booking before update to check if voice call was already triggered
    const currentBooking = await BookingService.findById(req.params.id);
    if (!currentBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // For completion status, handle voice call atomically to prevent duplicates
    if (status === 'completed' && !currentBooking.completionCallTriggered) {
      try {
        // First, mark the completion call as triggered atomically with the status update
        const booking = await BookingService.updateStatus(req.params.id, status, technicianNotes, true);
        
        // Get user details for phone number
        const { UserService } = await import('../../src/lib/db-services');
        const user = await UserService.findById(booking.userId);
        
        if (user && user.phone) {
          console.log(`Triggering completion voice call for booking ${booking.id}`);
          const callSuccess = await makeCompletionVoiceCall({
            to: user.phone,
            bookingId: booking.id,
          });
          
          if (!callSuccess) {
            console.log(`Voice call failed for booking ${booking.id}, but status remains completed`);
          }
        } else {
          console.log(`No phone number available for user ${booking.userId}, skipping voice call`);
        }
        
        res.json(booking);
        return;
      } catch (callError) {
        console.error('Error triggering completion voice call:', callError);
        // Status and call trigger flag were already updated, continue normally
      }
    }
    
    // Normal status update (not completion or already triggered)
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