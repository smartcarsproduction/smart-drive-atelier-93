"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const database_1 = require("../lib/database");
const schema_1 = require("../../src/lib/schema");
const drizzle_orm_1 = require("drizzle-orm");
const router = (0, express_1.Router)();
exports.analyticsRoutes = router;
// Get analytics overview
router.get('/overview', auth_1.requireAdmin, async (req, res) => {
    try {
        const { period = '30' } = req.query; // days
        const days = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        // Total bookings
        const totalBookingsResult = await database_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.bookings);
        const totalBookings = totalBookingsResult[0]?.count || 0;
        // Bookings in period
        const periodBookingsResult = await database_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.bookings)
            .where((0, drizzle_orm_1.gte)(schema_1.bookings.createdAt, startDate));
        const periodBookings = periodBookingsResult[0]?.count || 0;
        // Completed bookings
        const completedBookingsResult = await database_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.bookings)
            .where((0, drizzle_orm_1.eq)(schema_1.bookings.status, 'completed'));
        const completedBookings = completedBookingsResult[0]?.count || 0;
        // Revenue from completed bookings
        const revenueResult = await database_1.db
            .select({ total: (0, drizzle_orm_1.sum)(schema_1.bookings.totalPrice) })
            .from(schema_1.bookings)
            .where((0, drizzle_orm_1.eq)(schema_1.bookings.status, 'completed'));
        const totalRevenue = parseFloat(revenueResult[0]?.total || '0');
        // Revenue in period
        const periodRevenueResult = await database_1.db
            .select({ total: (0, drizzle_orm_1.sum)(schema_1.bookings.totalPrice) })
            .from(schema_1.bookings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.status, 'completed'), (0, drizzle_orm_1.gte)(schema_1.bookings.createdAt, startDate)));
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
    }
    catch (error) {
        console.error('Error fetching analytics overview:', error);
        res.status(500).json({ error: 'Failed to fetch analytics overview' });
    }
});
// Get booking analytics by day/week/month
router.get('/bookings', auth_1.requireAdmin, async (req, res) => {
    try {
        const { groupBy = 'day', period = '30' } = req.query;
        const days = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        let dateFormat;
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
        const bookingsData = await database_1.db
            .select({
            date: (0, drizzle_orm_1.sql) `TO_CHAR(${schema_1.bookings.createdAt}, '${drizzle_orm_1.sql.raw(dateFormat)}')`,
            count: (0, drizzle_orm_1.count)(),
            revenue: (0, drizzle_orm_1.sum)(schema_1.bookings.totalPrice)
        })
            .from(schema_1.bookings)
            .where((0, drizzle_orm_1.gte)(schema_1.bookings.createdAt, startDate))
            .groupBy((0, drizzle_orm_1.sql) `TO_CHAR(${schema_1.bookings.createdAt}, '${drizzle_orm_1.sql.raw(dateFormat)}')`)
            .orderBy((0, drizzle_orm_1.sql) `TO_CHAR(${schema_1.bookings.createdAt}, '${drizzle_orm_1.sql.raw(dateFormat)}')`);
        res.json({ bookingsData });
    }
    catch (error) {
        console.error('Error fetching booking analytics:', error);
        res.status(500).json({ error: 'Failed to fetch booking analytics' });
    }
});
// Get popular services
router.get('/services/popular', auth_1.requireAdmin, async (req, res) => {
    try {
        const { limit = '10' } = req.query;
        const popularServices = await database_1.db
            .select({
            serviceId: schema_1.bookings.serviceId,
            serviceName: schema_1.services.name,
            bookingCount: (0, drizzle_orm_1.count)(),
            totalRevenue: (0, drizzle_orm_1.sum)(schema_1.bookings.totalPrice)
        })
            .from(schema_1.bookings)
            .leftJoin(schema_1.services, (0, drizzle_orm_1.eq)(schema_1.bookings.serviceId, schema_1.services.id))
            .groupBy(schema_1.bookings.serviceId, schema_1.services.name)
            .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.count)()))
            .limit(parseInt(limit));
        res.json({ popularServices });
    }
    catch (error) {
        console.error('Error fetching popular services:', error);
        res.status(500).json({ error: 'Failed to fetch popular services' });
    }
});
// Get booking status distribution
router.get('/bookings/status', auth_1.requireAdmin, async (req, res) => {
    try {
        const statusDistribution = await database_1.db
            .select({
            status: schema_1.bookings.status,
            count: (0, drizzle_orm_1.count)()
        })
            .from(schema_1.bookings)
            .groupBy(schema_1.bookings.status);
        res.json({ statusDistribution });
    }
    catch (error) {
        console.error('Error fetching booking status distribution:', error);
        res.status(500).json({ error: 'Failed to fetch booking status distribution' });
    }
});
// Get revenue analytics
router.get('/revenue', auth_1.requireAdmin, async (req, res) => {
    try {
        const { period = '30' } = req.query;
        const days = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        // Daily revenue
        const dailyRevenue = await database_1.db
            .select({
            date: (0, drizzle_orm_1.sql) `DATE(${schema_1.bookings.actualCompletion})`,
            revenue: (0, drizzle_orm_1.sum)(schema_1.bookings.totalPrice),
            bookingCount: (0, drizzle_orm_1.count)()
        })
            .from(schema_1.bookings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.status, 'completed'), (0, drizzle_orm_1.gte)(schema_1.bookings.actualCompletion, startDate)))
            .groupBy((0, drizzle_orm_1.sql) `DATE(${schema_1.bookings.actualCompletion})`)
            .orderBy((0, drizzle_orm_1.sql) `DATE(${schema_1.bookings.actualCompletion})`);
        // Revenue by service category
        const revenueByCategory = await database_1.db
            .select({
            category: schema_1.services.category,
            revenue: (0, drizzle_orm_1.sum)(schema_1.bookings.totalPrice),
            bookingCount: (0, drizzle_orm_1.count)()
        })
            .from(schema_1.bookings)
            .leftJoin(schema_1.services, (0, drizzle_orm_1.eq)(schema_1.bookings.serviceId, schema_1.services.id))
            .where((0, drizzle_orm_1.eq)(schema_1.bookings.status, 'completed'))
            .groupBy(schema_1.services.category)
            .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sum)(schema_1.bookings.totalPrice)));
        res.json({
            dailyRevenue,
            revenueByCategory
        });
    }
    catch (error) {
        console.error('Error fetching revenue analytics:', error);
        res.status(500).json({ error: 'Failed to fetch revenue analytics' });
    }
});
