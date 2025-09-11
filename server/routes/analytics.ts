import { Router } from 'express';
import { BookingService, ServiceService } from '../../src/lib/db-services';
import { 
  requireAdmin,
  AuthenticatedRequest 
} from '../middleware/auth';
import { db } from '../lib/database';
import { bookings, services } from '../../src/lib/schema';
import { eq, and, gte, lte, desc, count, sum, sql } from 'drizzle-orm';

const router = Router();

// Get analytics overview
router.get('/overview', requireAdmin, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total bookings
    const totalBookingsResult = await db
      .select({ count: count() })
      .from(bookings);
    const totalBookings = totalBookingsResult[0]?.count || 0;

    // Bookings in period
    const periodBookingsResult = await db
      .select({ count: count() })
      .from(bookings)
      .where(gte(bookings.createdAt, startDate));
    const periodBookings = periodBookingsResult[0]?.count || 0;

    // Completed bookings
    const completedBookingsResult = await db
      .select({ count: count() })
      .from(bookings)
      .where(eq(bookings.status, 'completed'));
    const completedBookings = completedBookingsResult[0]?.count || 0;

    // Revenue from completed bookings
    const revenueResult = await db
      .select({ total: sum(bookings.totalPrice) })
      .from(bookings)
      .where(eq(bookings.status, 'completed'));
    const totalRevenue = parseFloat(revenueResult[0]?.total || '0');

    // Revenue in period
    const periodRevenueResult = await db
      .select({ total: sum(bookings.totalPrice) })
      .from(bookings)
      .where(and(
        eq(bookings.status, 'completed'),
        gte(bookings.createdAt, startDate)
      ));
    const periodRevenue = parseFloat(periodRevenueResult[0]?.total || '0');

    res.json({
      overview: {
        totalBookings,
        periodBookings,
        completedBookings,
        totalRevenue,
        periodRevenue,
        period: days
      }
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    res.status(500).json({ error: 'Failed to fetch analytics overview' });
  }
});

// Get booking analytics by day/week/month
router.get('/bookings', requireAdmin, async (req, res) => {
  try {
    const { groupBy = 'day', period = '30' } = req.query;
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let dateFormat: string;
    switch (groupBy) {
      case 'week':
        dateFormat = 'YYYY-"W"WW';
        break;
      case 'month':
        dateFormat = 'YYYY-MM';
        break;
      default:
        dateFormat = 'YYYY-MM-DD';
    }

    const bookingsData = await db
      .select({
        date: sql`TO_CHAR(${bookings.createdAt}, '${sql.raw(dateFormat)}')`,
        count: count(),
        revenue: sum(bookings.totalPrice)
      })
      .from(bookings)
      .where(gte(bookings.createdAt, startDate))
      .groupBy(sql`TO_CHAR(${bookings.createdAt}, '${sql.raw(dateFormat)}')`)
      .orderBy(sql`TO_CHAR(${bookings.createdAt}, '${sql.raw(dateFormat)}')`);

    res.json({ bookingsData });
  } catch (error) {
    console.error('Error fetching booking analytics:', error);
    res.status(500).json({ error: 'Failed to fetch booking analytics' });
  }
});

// Get popular services
router.get('/services/popular', requireAdmin, async (req, res) => {
  try {
    const { limit = '10' } = req.query;
    
    const popularServices = await db
      .select({
        serviceId: bookings.serviceId,
        serviceName: services.name,
        bookingCount: count(),
        totalRevenue: sum(bookings.totalPrice)
      })
      .from(bookings)
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .groupBy(bookings.serviceId, services.name)
      .orderBy(desc(count()))
      .limit(parseInt(limit as string));

    res.json({ popularServices });
  } catch (error) {
    console.error('Error fetching popular services:', error);
    res.status(500).json({ error: 'Failed to fetch popular services' });
  }
});

// Get booking status distribution
router.get('/bookings/status', requireAdmin, async (req, res) => {
  try {
    const statusDistribution = await db
      .select({
        status: bookings.status,
        count: count()
      })
      .from(bookings)
      .groupBy(bookings.status);

    res.json({ statusDistribution });
  } catch (error) {
    console.error('Error fetching booking status distribution:', error);
    res.status(500).json({ error: 'Failed to fetch booking status distribution' });
  }
});

// Get revenue analytics
router.get('/revenue', requireAdmin, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Daily revenue
    const dailyRevenue = await db
      .select({
        date: sql`DATE(${bookings.actualCompletion})`,
        revenue: sum(bookings.totalPrice),
        bookingCount: count()
      })
      .from(bookings)
      .where(and(
        eq(bookings.status, 'completed'),
        gte(bookings.actualCompletion, startDate)
      ))
      .groupBy(sql`DATE(${bookings.actualCompletion})`)
      .orderBy(sql`DATE(${bookings.actualCompletion})`);

    // Revenue by service category
    const revenueByCategory = await db
      .select({
        category: services.category,
        revenue: sum(bookings.totalPrice),
        bookingCount: count()
      })
      .from(bookings)
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .where(eq(bookings.status, 'completed'))
      .groupBy(services.category)
      .orderBy(desc(sum(bookings.totalPrice)));

    res.json({ 
      dailyRevenue,
      revenueByCategory 
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ error: 'Failed to fetch revenue analytics' });
  }
});

export { router as analyticsRoutes };