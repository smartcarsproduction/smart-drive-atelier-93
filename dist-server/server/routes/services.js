"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRoutes = void 0;
const express_1 = require("express");
const db_services_1 = require("../../src/lib/db-services");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.serviceRoutes = router;
// Validation schemas
const createServiceSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    category: zod_1.z.enum(['maintenance', 'detailing', 'diagnostics', 'customization']),
    price: zod_1.z.string().optional(), // Decimal as string
    estimatedDuration: zod_1.z.number().int().min(1).optional(),
    requiresPickup: zod_1.z.boolean().default(false),
    luxuryLevel: zod_1.z.enum(['standard', 'premium', 'elite']).default('standard'),
});
const updateServiceSchema = createServiceSchema.partial();
// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await db_services_1.ServiceService.getAll();
        res.json(services);
    }
    catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});
// Get services by category
router.get('/category/:category', async (req, res) => {
    try {
        const services = await db_services_1.ServiceService.getByCategory(req.params.category);
        res.json(services);
    }
    catch (error) {
        console.error('Error fetching services by category:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});
// Get service by ID
router.get('/:id', async (req, res) => {
    try {
        const service = await db_services_1.ServiceService.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
    }
    catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ error: 'Failed to fetch service' });
    }
});
// Create service (admin only)
router.post('/', auth_1.requireAdmin, async (req, res) => {
    try {
        const serviceData = createServiceSchema.parse(req.body);
        const service = await db_services_1.ServiceService.create(serviceData);
        res.status(201).json(service);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Failed to create service' });
    }
});
// Update service (admin only)
router.put('/:id', auth_1.requireAdmin, async (req, res) => {
    try {
        const updates = updateServiceSchema.parse(req.body);
        const service = await db_services_1.ServiceService.update(req.params.id, updates);
        res.json(service);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Failed to update service' });
    }
});
