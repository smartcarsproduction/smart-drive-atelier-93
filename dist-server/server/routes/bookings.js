"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = require("express");
const db_services_1 = require("../../src/lib/db-services");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const twilio_1 = require("../utils/twilio");
const router = (0, express_1.Router)();
exports.bookingRoutes = router;
// Validation schemas
const createBookingSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    vehicleId: zod_1.z.string().uuid(),
    serviceId: zod_1.z.string().uuid(),
    scheduledDate: zod_1.z.string().datetime(),
    estimatedCompletion: zod_1.z.string().datetime().optional(),
    totalPrice: zod_1.z.string().optional(), // Decimal as string
    notes: zod_1.z.string().optional(),
    pickupAddress: zod_1.z.string().optional(),
    deliveryAddress: zod_1.z.string().optional(),
    priority: zod_1.z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});
const updateBookingStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
    technicianNotes: zod_1.z.string().optional(),
});
// Get all bookings (admin only)
router.get('/', auth_1.requireAdmin, async (req, res) => {
    try {
        const bookings = await db_services_1.BookingService.getAllBookings();
        res.json(bookings);
    }
    catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});
// Get bookings by status (admin only)
router.get('/status/:status', auth_1.requireAdmin, async (req, res) => {
    try {
        const bookings = await db_services_1.BookingService.getBookingsByStatus(req.params.status);
        res.json(bookings);
    }
    catch (error) {
        console.error('Error fetching bookings by status:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});
// Get bookings by user ID (authenticated users - own bookings or admin)
router.get('/user/:userId', auth_1.authenticateToken, async (req, res) => {
    try {
        // Users can only access their own bookings, admins can access any
        if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
            return res.status(403).json({ error: 'Cannot access other user\'s bookings' });
        }
        const bookings = await db_services_1.BookingService.findByUserId(req.params.userId);
        res.json(bookings);
    }
    catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});
// Get current user's bookings
router.get('/my-bookings', auth_1.authenticateToken, async (req, res) => {
    try {
        const bookings = await db_services_1.BookingService.findByUserId(req.user.id);
        res.json(bookings);
    }
    catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});
// Get bookings by vehicle ID (vehicle owner or admin only)
router.get('/vehicle/:vehicleId', auth_1.authenticateToken, async (req, res) => {
    try {
        // Check vehicle ownership first (if not admin)
        if (req.user.role !== 'admin') {
            const { VehicleService } = await Promise.resolve().then(() => __importStar(require('../../src/lib/db-services')));
            const vehicle = await VehicleService.findById(req.params.vehicleId);
            if (!vehicle) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }
            if (vehicle.userId !== req.user.id) {
                return res.status(403).json({ error: 'Cannot access other user\'s vehicle bookings' });
            }
        }
        const bookings = await db_services_1.BookingService.findByVehicleId(req.params.vehicleId);
        res.json(bookings);
    }
    catch (error) {
        console.error('Error fetching vehicle bookings:', error);
        res.status(500).json({ error: 'Failed to fetch vehicle bookings' });
    }
});
// Get upcoming bookings by vehicle ID (vehicle owner or admin only) 
router.get('/vehicle/:vehicleId/upcoming', auth_1.authenticateToken, async (req, res) => {
    try {
        // Check vehicle ownership first (if not admin)
        if (req.user.role !== 'admin') {
            const { VehicleService } = await Promise.resolve().then(() => __importStar(require('../../src/lib/db-services')));
            const vehicle = await VehicleService.findById(req.params.vehicleId);
            if (!vehicle) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }
            if (vehicle.userId !== req.user.id) {
                return res.status(403).json({ error: 'Cannot access other user\'s vehicle bookings' });
            }
        }
        const bookings = await db_services_1.BookingService.getUpcomingBookingsForVehicle(req.params.vehicleId);
        res.json(bookings);
    }
    catch (error) {
        console.error('Error fetching upcoming vehicle bookings:', error);
        res.status(500).json({ error: 'Failed to fetch upcoming vehicle bookings' });
    }
});
// Get booking by ID (owner or admin only)
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const booking = await db_services_1.BookingService.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        // Users can only access their own bookings, admins can access any
        if (req.user.role !== 'admin' && req.user.id !== booking.userId) {
            return res.status(403).json({ error: 'Cannot access other user\'s booking' });
        }
        res.json(booking);
    }
    catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});
// Create booking (authenticated users can create for themselves, admins can create for anyone)
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const bookingData = createBookingSchema.parse({
            ...req.body,
            scheduledDate: new Date(req.body.scheduledDate).toISOString(),
            estimatedCompletion: req.body.estimatedCompletion
                ? new Date(req.body.estimatedCompletion).toISOString()
                : undefined,
        });
        // If not admin, force userId to be the authenticated user
        if (req.user.role !== 'admin') {
            bookingData.userId = req.user.id;
        }
        // Validate userId matches authenticated user or user is admin
        if (req.user.role !== 'admin' && bookingData.userId !== req.user.id) {
            return res.status(403).json({ error: 'Cannot create booking for other users' });
        }
        const booking = await db_services_1.BookingService.create({
            ...bookingData,
            scheduledDate: new Date(bookingData.scheduledDate),
            estimatedCompletion: bookingData.estimatedCompletion
                ? new Date(bookingData.estimatedCompletion)
                : undefined,
        });
        res.status(201).json(booking);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});
// Update booking status (admin or technician only)
router.patch('/:id/status', auth_1.authenticateToken, async (req, res) => {
    try {
        // Only admin or technician can update booking status
        if (!['admin', 'technician'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions to update booking status' });
        }
        const { status, technicianNotes } = updateBookingStatusSchema.parse(req.body);
        // Get the current booking before update to check if voice call was already triggered
        const currentBooking = await db_services_1.BookingService.findById(req.params.id);
        if (!currentBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        // For completion status, handle voice call atomically to prevent duplicates
        if (status === 'completed' && !currentBooking.completionCallTriggered) {
            try {
                // First, mark the completion call as triggered atomically with the status update
                const booking = await db_services_1.BookingService.updateStatus(req.params.id, status, technicianNotes, true);
                // Get user details for phone number
                const { UserService } = await Promise.resolve().then(() => __importStar(require('../../src/lib/db-services')));
                const user = await UserService.findById(booking.userId);
                if (user && user.phone) {
                    console.log(`Triggering completion voice call for booking ${booking.id}`);
                    const callSuccess = await (0, twilio_1.makeCompletionVoiceCall)({
                        to: user.phone,
                        bookingId: booking.id,
                    });
                    if (!callSuccess) {
                        console.log(`Voice call failed for booking ${booking.id}, but status remains completed`);
                    }
                }
                else {
                    console.log(`No phone number available for user ${booking.userId}, skipping voice call`);
                }
                res.json(booking);
                return;
            }
            catch (callError) {
                console.error('Error triggering completion voice call:', callError);
                // Status and call trigger flag were already updated, continue normally
            }
        }
        // Normal status update (not completion or already triggered)
        const booking = await db_services_1.BookingService.updateStatus(req.params.id, status, technicianNotes);
        res.json(booking);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});
