"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = require("express");
const db_services_1 = require("../../src/lib/db-services");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.notificationRoutes = router;
// Validation schemas
const createNotificationSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    type: zod_1.z.enum(['booking_confirmed', 'service_completed', 'reminder', 'promotion']),
    title: zod_1.z.string().min(1),
    message: zod_1.z.string().min(1),
    relatedBookingId: zod_1.z.string().uuid().optional(),
});
// Get notifications for user (own notifications or admin)
router.get('/user/:userId', auth_1.authenticateToken, async (req, res) => {
    try {
        // Users can only access their own notifications, admins can access any
        if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
            return res.status(403).json({ error: 'Cannot access other user\'s notifications' });
        }
        const notifications = await db_services_1.NotificationService.getForUser(req.params.userId);
        res.json(notifications);
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
// Get current user's notifications
router.get('/my-notifications', auth_1.authenticateToken, async (req, res) => {
    try {
        const notifications = await db_services_1.NotificationService.getForUser(req.user.id);
        res.json(notifications);
    }
    catch (error) {
        console.error('Error fetching user notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
// Get unread count for user (own count or admin)
router.get('/user/:userId/unread-count', auth_1.authenticateToken, async (req, res) => {
    try {
        // Users can only access their own unread count, admins can access any
        if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
            return res.status(403).json({ error: 'Cannot access other user\'s notifications' });
        }
        const count = await db_services_1.NotificationService.getUnreadCount(req.params.userId);
        res.json({ count });
    }
    catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
});
// Get current user's unread count
router.get('/my-unread-count', auth_1.authenticateToken, async (req, res) => {
    try {
        const count = await db_services_1.NotificationService.getUnreadCount(req.user.id);
        res.json({ count });
    }
    catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
});
// Create notification (admin only)
router.post('/', auth_1.requireAdmin, async (req, res) => {
    try {
        const notificationData = createNotificationSchema.parse(req.body);
        const notification = await db_services_1.NotificationService.create(notificationData);
        res.status(201).json(notification);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Failed to create notification' });
    }
});
// Mark notification as read (authenticated users only)
router.patch('/:id/read', auth_1.authenticateToken, async (req, res) => {
    try {
        // First, verify the notification belongs to the current user or user is admin
        const notification = await db_services_1.NotificationService.getById(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        // Only allow users to mark their own notifications as read, or admins can mark any
        if (req.user.role !== 'admin' && notification.userId !== req.user.id) {
            return res.status(403).json({ error: 'Cannot mark other user\'s notification as read' });
        }
        await db_services_1.NotificationService.markAsRead(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});
