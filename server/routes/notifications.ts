import { Router } from 'express';
import { NotificationService } from '../../src/lib/db-services';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(['booking_confirmed', 'service_completed', 'reminder', 'promotion']),
  title: z.string().min(1),
  message: z.string().min(1),
  relatedBookingId: z.string().uuid().optional(),
});

// Get notifications for user
router.get('/user/:userId', async (req, res) => {
  try {
    const notifications = await NotificationService.getForUser(req.params.userId);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get unread count for user
router.get('/user/:userId/unread-count', async (req, res) => {
  try {
    const count = await NotificationService.getUnreadCount(req.params.userId);
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Create notification
router.post('/', async (req, res) => {
  try {
    const notificationData = createNotificationSchema.parse(req.body);
    const notification = await NotificationService.create(notificationData);
    res.status(201).json(notification);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    await NotificationService.markAsRead(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

export { router as notificationRoutes };