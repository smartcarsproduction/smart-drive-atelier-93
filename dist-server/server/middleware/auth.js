"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireCustomerOrAdmin = exports.requireAdmin = exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_services_1 = require("../../src/lib/db-services");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required for security');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            // Get fresh user data from database
            const user = await db_services_1.UserService.findById(decoded.sub);
            if (!user || !user.isActive) {
                res.status(401).json({ error: 'User not found or inactive' });
                return;
            }
            req.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            };
            next();
        }
        catch (jwtError) {
            if (jwtError instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.status(401).json({ error: 'Token expired' });
            }
            else if (jwtError instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                res.status(403).json({ error: 'Invalid token' });
            }
            else {
                res.status(500).json({ error: 'Token verification failed' });
            }
            return;
        }
    }
    catch (error) {
        console.error('Authentication middleware error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};
exports.authenticateToken = authenticateToken;
// Role-based authorization middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                error: 'Insufficient permissions',
                required: roles,
                current: req.user.role
            });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
// Admin-only authorization
exports.requireAdmin = (0, exports.authorizeRoles)('admin');
// Customer or Admin authorization
exports.requireCustomerOrAdmin = (0, exports.authorizeRoles)('customer', 'admin');
// Optional authentication (for routes that can work with or without auth)
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        next();
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await db_services_1.UserService.findById(decoded.sub);
        if (user && user.isActive) {
            req.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            };
        }
    }
    catch (error) {
        // Silently fail for optional auth
        console.log('Optional auth failed:', error);
    }
    next();
};
exports.optionalAuth = optionalAuth;
