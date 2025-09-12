"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const users_1 = require("./routes/users");
const vehicles_1 = require("./routes/vehicles");
const services_1 = require("./routes/services");
const bookings_1 = require("./routes/bookings");
const content_1 = require("./routes/content");
const notifications_1 = require("./routes/notifications");
const serviceHistory_1 = require("./routes/serviceHistory");
const analytics_1 = require("./routes/analytics");
const timeSlots_1 = require("./routes/timeSlots");
// In production (compiled), we'll be at dist-server/server/index.js
// so we need to go up two levels to reach the project root
const __dirname = process.cwd();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : ['http://localhost:5000', 'http://localhost:3000'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API Routes
app.use('/api/users', users_1.userRoutes);
app.use('/api/vehicles', vehicles_1.vehicleRoutes);
app.use('/api/services', services_1.serviceRoutes);
app.use('/api/bookings', bookings_1.bookingRoutes);
app.use('/api/content', content_1.contentRoutes);
app.use('/api/notifications', notifications_1.notificationRoutes);
app.use('/api/service-history', serviceHistory_1.serviceHistoryRoutes);
app.use('/api/analytics', analytics_1.analyticsRoutes);
app.use('/api/time-slots', timeSlots_1.timeSlotsRoutes);
// Health check endpoint - MUST be before wildcard routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, 'dist')));
    // Handle React Router - send all non-API requests to index.html
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path_1.default.join(__dirname, 'dist/index.html'));
        }
        else {
            res.status(404).json({ error: 'API endpoint not found' });
        }
    });
}
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
// Error handler
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
