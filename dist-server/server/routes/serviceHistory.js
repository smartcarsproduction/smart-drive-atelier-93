"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceHistoryRoutes = void 0;
const express_1 = require("express");
const db_services_1 = require("../../src/lib/db-services");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.serviceHistoryRoutes = router;
// Validation schemas
const createServiceHistorySchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    vehicleId: zod_1.z.string().uuid(),
    serviceId: zod_1.z.string().uuid(),
    completedDate: zod_1.z.string().datetime(),
    rating: zod_1.z.number().int().min(1).max(5).optional(),
    review: zod_1.z.string().optional(),
    totalPrice: zod_1.z.string().optional(), // Decimal as string
    technicianId: zod_1.z.string().uuid().optional(),
});
// Get service history for user (own history or admin)
router.get('/user/:userId', auth_1.authenticateToken, async (req, res) => {
    try {
        // Users can only access their own history, admins can access any
        if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
            return res.status(403).json({ error: 'Cannot access other user\'s service history' });
        }
        const history = await db_services_1.ServiceHistoryService.getForUser(req.params.userId);
        res.json(history);
    }
    catch (error) {
        console.error('Error fetching service history:', error);
        res.status(500).json({ error: 'Failed to fetch service history' });
    }
});
// Get current user's service history
router.get('/my-history', auth_1.authenticateToken, async (req, res) => {
    try {
        const history = await db_services_1.ServiceHistoryService.getForUser(req.user.id);
        res.json(history);
    }
    catch (error) {
        console.error('Error fetching service history:', error);
        res.status(500).json({ error: 'Failed to fetch service history' });
    }
});
// Get service history for vehicle (vehicle owner or admin)
router.get('/vehicle/:vehicleId', auth_1.authenticateToken, async (req, res) => {
    try {
        // Note: Should check vehicle ownership here for non-admin users
        // For now, allowing authenticated users - in production would need vehicle ownership check
        const history = await db_services_1.ServiceHistoryService.getForVehicle(req.params.vehicleId);
        res.json(history);
    }
    catch (error) {
        console.error('Error fetching vehicle service history:', error);
        res.status(500).json({ error: 'Failed to fetch service history' });
    }
});
// Create service history record (admin or technician only)
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        // Only admin or technician can create service history records
        if (!['admin', 'technician'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions to create service history' });
        }
        const historyData = createServiceHistorySchema.parse({
            ...req.body,
            completedDate: new Date(req.body.completedDate).toISOString(),
        });
        const history = await db_services_1.ServiceHistoryService.create({
            ...historyData,
            completedDate: new Date(historyData.completedDate),
            technicianId: historyData.technicianId || req.user.id, // Default to current user if not specified
        });
        res.status(201).json(history);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        console.error('Error creating service history:', error);
        res.status(500).json({ error: 'Failed to create service history' });
    }
});
