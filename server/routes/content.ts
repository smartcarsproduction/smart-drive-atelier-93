import { Router } from 'express';
import { ContentService } from '../../src/lib/db-services';
import { z } from 'zod';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Validation schemas
const createContentSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  category: z.enum(['general', 'services', 'contact', 'about']).default('general'),
  isPublic: z.boolean().default(true),
  updatedBy: z.string().uuid().optional(),
});

const updateContentSchema = z.object({
  value: z.string().min(1),
  updatedBy: z.string().uuid().optional(),
});

// Get all content (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const content = await ContentService.getAll();
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Get public content (no authentication required)
router.get('/public', async (req, res) => {
  try {
    const content = await ContentService.getPublic();
    res.json(content);
  } catch (error) {
    console.error('Error fetching public content:', error);
    res.status(500).json({ error: 'Failed to fetch public content' });
  }
});

// Get content by category
router.get('/category/:category', async (req, res) => {
  try {
    const content = await ContentService.getByCategory(req.params.category);
    res.json(content);
  } catch (error) {
    console.error('Error fetching content by category:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Get content by key
router.get('/key/:key', async (req, res) => {
  try {
    const value = await ContentService.get(req.params.key);
    if (value === null) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json({ key: req.params.key, value });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Create or update content (admin only)
router.put('/key/:key', requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { value, updatedBy } = updateContentSchema.parse(req.body);
    const content = await ContentService.set(req.params.key, value, 'general', updatedBy || req.user!.id);
    res.json(content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Create content with category (admin only)
router.post('/', requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { key, value, category, updatedBy } = createContentSchema.parse(req.body);
    const content = await ContentService.set(key, value, category, updatedBy || req.user!.id);
    res.status(201).json(content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

export { router as contentRoutes };