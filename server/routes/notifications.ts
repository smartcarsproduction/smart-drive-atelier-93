import { Router } from 'express';
import { NotificationService } from '../../src/lib/db-services';
import { z } from 'zod';
import { 
  authenticateToken, 
  requireAdmin,
  AuthenticatedRequest 
} from '../middleware/auth';

const router = Router();

// Validation schemas
const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(['booking_confirmed', 'service_completed', 'reminder', 'promotion']),
  title: z.string().min(1),
  message: z.string().min(1),
  relatedBookingId: z.string().uuid().optional(),
});

// Get notifications for user (own notifications or admin)
router.get('/user/:userId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Users can only access their own notifications, admins can access any
    if (req.user!.role !== 'admin' && req.user!.id !== req.params.userId) {
      return res.status(403).json({ error: 'Cannot access other user\'s notifications' });
    }

    const notifications = await NotificationService.getForUser(req.params.userId);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get current user's notifications
router.get('/my-notifications', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const notifications = await NotificationService.getForUser(req.user!.id);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get unread count for user (own count or admin)
router.get('/user/:userId/unread-count', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Users can only access their own unread count, admins can access any
    if (req.user!.role !== 'admin' && req.user!.id !== req.params.userId) {
      return res.status(403).json({ error: 'Cannot access other user\'s notifications' });
    }

    const count = await NotificationService.getUnreadCount(req.params.userId);
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Get current user's unread count
router.get('/my-unread-count', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const count = await NotificationService.getUnreadCount(req.user!.id);
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Create notification (admin only)
router.post('/', requireAdmin, async (req, res) => {
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

// Mark notification as read (authenticated users only)
router.patch('/:id/read', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // First, verify the notification belongs to the current user or user is admin
    const notification = await NotificationService.getById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    // Only allow users to mark their own notifications as read, or admins can mark any
    if (req.user!.role !== 'admin' && notification.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Cannot mark other user\'s notification as read' });
    }
    
    await NotificationService.markAsRead(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

export { router as notificationRoutes };