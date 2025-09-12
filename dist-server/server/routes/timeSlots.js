"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeSlotsRoutes = void 0;
const express_1 = require("express");
const db_services_1 = require("../../src/lib/db-services");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.timeSlotsRoutes = router;
// Validation schemas
const createTimeSlotsSchema = zod_1.z.object({
    date: zod_1.z.string().datetime(),
    startTime: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM'),
    endTime: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM'),
    maxCapacity: zod_1.z.number().int().min(1).default(1),
});
const bookTimeSlotSchema = zod_1.z.object({
    timeSlotId: zod_1.z.string().uuid(),
    bookingId: zod_1.z.string().uuid(),
});
// Get available time slots for a specific date
router.get('/available/:date', auth_1.authenticateToken, async (req, res) => {
    try {
        const date = new Date(req.params.date);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        const availableSlots = await db_services_1.TimeSlotsService.getAvailableSlots(date);
        res.json(availableSlots);
    }
    catch (error) {
        console.error('Error fetching available time slots:', error);
        res.status(500).json({ error: 'Failed to fetch available time slots' });
    }
});
// Get all time slots for a date range (admin only)
router.get('/range', auth_1.requireAdmin, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'startDate and endDate are required' });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        const slots = await db_services_1.TimeSlotsService.getSlotsInRange(start, end);
        res.json(slots);
    }
    catch (error) {
        console.error('Error fetching time slots:', error);
        res.status(500).json({ error: 'Failed to fetch time slots' });
    }
});
// Create time slots (admin only)
router.post('/', auth_1.requireAdmin, async (req, res) => {
    try {
        const slotData = createTimeSlotsSchema.parse(req.body);
        const timeSlot = await db_services_1.TimeSlotsService.create({
            ...slotData,
            date: new Date(slotData.date),
        });
        res.status(201).json(timeSlot);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        console.error('Error creating time slot:', error);
        res.status(500).json({ error: 'Failed to create time slot' });
    }
});
// Book a time slot
router.post('/book', auth_1.authenticateToken, async (req, res) => {
    try {
        const { timeSlotId, bookingId } = bookTimeSlotSchema.parse(req.body);
        const success = await db_services_1.TimeSlotsService.bookSlot(timeSlotId, bookingId);
        if (!success) {
            return res.status(409).json({ error: 'Time slot is no longer available' });
        }
        res.json({ success: true, message: 'Time slot booked successfully' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        console.error('Error booking time slot:', error);
        res.status(500).json({ error: 'Failed to book time slot' });
    }
});
// Generate time slots for a date range (admin only)
router.post('/generate', auth_1.requireAdmin, async (req, res) => {
    try {
        const { startDate, endDate, startTime, endTime, slotDuration, maxCapacity } = req.body;
        if (!startDate || !endDate || !startTime || !endTime || !slotDuration) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const slots = await db_services_1.TimeSlotsService.generateSlots({
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            startTime,
            endTime,
            slotDuration: parseInt(slotDuration),
            maxCapacity: maxCapacity || 1,
        });
        res.json({ message: `Generated ${slots.length} time slots`, slots });
    }
    catch (error) {
        console.error('Error generating time slots:', error);
        res.status(500).json({ error: 'Failed to generate time slots' });
    }
});
