"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentRoutes = void 0;
const express_1 = require("express");
const db_services_1 = require("../../src/lib/db-services");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.contentRoutes = router;
// Validation schemas
const createContentSchema = zod_1.z.object({
    key: zod_1.z.string().min(1),
    value: zod_1.z.string().min(1),
    category: zod_1.z.enum(['general', 'services', 'contact', 'about']).default('general'),
    isPublic: zod_1.z.boolean().default(true),
    updatedBy: zod_1.z.string().uuid().optional(),
});
const updateContentSchema = zod_1.z.object({
    value: zod_1.z.string().min(1),
    updatedBy: zod_1.z.string().uuid().optional(),
});
// Get all content (admin only)
router.get('/', auth_1.requireAdmin, async (req, res) => {
    try {
        const content = await db_services_1.ContentService.getAll();
        res.json(content);
    }
    catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});
// Get public content (no authentication required)
router.get('/public', async (req, res) => {
    try {
        const content = await db_services_1.ContentService.getPublic();
        res.json(content);
    }
    catch (error) {
        console.error('Error fetching public content:', error);
        res.status(500).json({ error: 'Failed to fetch public content' });
    }
});
// Get content by category
router.get('/category/:category', async (req, res) => {
    try {
        const content = await db_services_1.ContentService.getByCategory(req.params.category);
        res.json(content);
    }
    catch (error) {
        console.error('Error fetching content by category:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});
// Get content by key
router.get('/key/:key', async (req, res) => {
    try {
        const value = await db_services_1.ContentService.get(req.params.key);
        if (value === null) {
            return res.status(404).json({ error: 'Content not found' });
        }
        res.json({ key: req.params.key, value });
    }
    catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});
// Create or update content (admin only)
router.put('/key/:key', auth_1.requireAdmin, async (req, res) => {
    try {
        const { value, updatedBy } = updateContentSchema.parse(req.body);
        const content = await db_services_1.ContentService.set(req.params.key, value, 'general', updatedBy || req.user.id);
        res.json(content);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        console.error('Error updating content:', error);
        res.status(500).json({ error: 'Failed to update content' });
    }
});
// Create content with category (admin only)
router.post('/', auth_1.requireAdmin, async (req, res) => {
    try {
        const { key, value, category, updatedBy } = createContentSchema.parse(req.body);
        const content = await db_services_1.ContentService.set(key, value, category, updatedBy || req.user.id);
        res.status(201).json(content);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        console.error('Error creating content:', error);
        res.status(500).json({ error: 'Failed to create content' });
    }
});
