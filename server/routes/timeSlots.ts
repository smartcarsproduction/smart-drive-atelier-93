import { Router } from 'express';
import { TimeSlotsService } from '../../src/lib/db-services';
import { z } from 'zod';
import { 
  authenticateToken, 
  requireAdmin,
  AuthenticatedRequest 
} from '../middleware/auth';

const router = Router();

// Validation schemas
const createTimeSlotsSchema = z.object({
  date: z.string().datetime(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM'),
  maxCapacity: z.number().int().min(1).default(1),
});

const bookTimeSlotSchema = z.object({
  timeSlotId: z.string().uuid(),
  bookingId: z.string().uuid(),
});

// Get available time slots for a specific date
router.get('/available/:date', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const date = new Date(req.params.date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const availableSlots = await TimeSlotsService.getAvailableSlots(date);
    res.json(availableSlots);
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    res.status(500).json({ error: 'Failed to fetch available time slots' });
  }
});

// Get all time slots for a date range (admin only)
router.get('/range', requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const slots = await TimeSlotsService.getSlotsInRange(start, end);
    res.json(slots);
  } catch (error) {
    console.error('Error fetching time slots:', error);
    res.status(500).json({ error: 'Failed to fetch time slots' });
  }
});

// Create time slots (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const slotData = createTimeSlotsSchema.parse(req.body);
    
    const timeSlot = await TimeSlotsService.create({
      ...slotData,
      date: new Date(slotData.date),
    });
    
    res.status(201).json(timeSlot);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error creating time slot:', error);
    res.status(500).json({ error: 'Failed to create time slot' });
  }
});

// Book a time slot
router.post('/book', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { timeSlotId, bookingId } = bookTimeSlotSchema.parse(req.body);
    
    const success = await TimeSlotsService.bookSlot(timeSlotId, bookingId);
    
    if (!success) {
      return res.status(409).json({ error: 'Time slot is no longer available' });
    }
    
    res.json({ success: true, message: 'Time slot booked successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error booking time slot:', error);
    res.status(500).json({ error: 'Failed to book time slot' });
  }
});

// Generate time slots for a date range (admin only)
router.post('/generate', requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate, startTime, endTime, slotDuration, maxCapacity } = req.body;
    
    if (!startDate || !endDate || !startTime || !endTime || !slotDuration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const slots = await TimeSlotsService.generateSlots({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime,
      endTime,
      slotDuration: parseInt(slotDuration),
      maxCapacity: maxCapacity || 1,
    });
    
    res.json({ message: `Generated ${slots.length} time slots`, slots });
  } catch (error) {
    console.error('Error generating time slots:', error);
    res.status(500).json({ error: 'Failed to generate time slots' });
  }
});

export { router as timeSlotsRoutes };