"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityUtils = exports.AuthResponse = exports.TokenUtils = exports.PasswordUtils = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required for security');
}
// Type assertion since we've confirmed JWT_SECRET exists above
const SECRET = JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const BCRYPT_ROUNDS = 12;
// Password hashing utilities
class PasswordUtils {
    /**
     * Hash a password using bcrypt with salt rounds
     */
    static async hashPassword(password) {
        if (!password || password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        return bcryptjs_1.default.hash(password, BCRYPT_ROUNDS);
    }
    /**
     * Compare a plain text password with a hashed password
     */
    static async comparePassword(password, hashedPassword) {
        return bcryptjs_1.default.compare(password, hashedPassword);
    }
    /**
     * Validate password strength
     */
    static validatePasswordStrength(password) {
        const errors = [];
        let score = 0;
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        else {
            score += 1;
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        else {
            score += 1;
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        else {
            score += 1;
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        else {
            score += 1;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        else {
            score += 1;
        }
        return {
            isValid: errors.length === 0,
            errors,
            score
        };
    }
}
exports.PasswordUtils = PasswordUtils;
// JWT token utilities
class TokenUtils {
    /**
     * Generate a JWT token for a user
     */
    static generateToken(payload) {
        return jsonwebtoken_1.default.sign({
            sub: payload.id,
            email: payload.email,
            role: payload.role,
            iat: Math.floor(Date.now() / 1000),
        }, SECRET, {
            expiresIn: JWT_EXPIRES_IN,
            issuer: 'smart-cars-elite',
            audience: 'smart-cars-users',
        });
    }
    /**
     * Generate a refresh token with longer expiration
     */
    static generateRefreshToken(userId) {
        return jsonwebtoken_1.default.sign({
            sub: userId,
            type: 'refresh',
            iat: Math.floor(Date.now() / 1000),
        }, SECRET, {
            expiresIn: '7d',
            issuer: 'smart-cars-elite',
            audience: 'smart-cars-users',
        });
    }
    /**
     * Verify and decode a JWT token
     */
    static verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, SECRET, {
            issuer: 'smart-cars-elite',
            audience: 'smart-cars-users',
        });
    }
    /**
     * Decode token without verification (for expired token handling)
     */
    static decodeToken(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch {
            return null;
        }
    }
    /**
     * Generate access and refresh token pair
     */
    static generateTokenPair(user) {
        const accessToken = this.generateToken(user);
        const refreshToken = this.generateRefreshToken(user.id);
        return {
            accessToken,
            refreshToken,
            expiresIn: JWT_EXPIRES_IN,
        };
    }
}
exports.TokenUtils = TokenUtils;
// Authentication response utilities
class AuthResponse {
    /**
     * Generate a standardized auth success response
     */
    static success(user) {
        const tokens = TokenUtils.generateTokenPair(user);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                picture: user.picture || undefined,
            },
            ...tokens,
        };
    }
    /**
     * Generate a standardized auth error response
     */
    static error(message, code = 'AUTH_ERROR') {
        return {
            error: message,
            code,
            timestamp: new Date().toISOString(),
        };
    }
}
exports.AuthResponse = AuthResponse;
// Security utilities
class SecurityUtils {
    /**
     * Generate a cryptographically secure random string for various uses
     */
    static generateSecureRandom(length = 32) {
        const crypto = require('crypto');
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const randomBytes = crypto.randomBytes(length);
        for (let i = 0; i < length; i++) {
            result += chars.charAt(randomBytes[i] % chars.length);
        }
        return result;
    }
    /**
     * Rate limiting helper - basic implementation
     */
    static attempts = new Map();
    static checkRateLimit(identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000 // 15 minutes
    ) {
        const now = Date.now();
        const key = identifier;
        let record = this.attempts.get(key);
        if (!record || now > record.resetTime) {
            record = {
                count: 0,
                resetTime: now + windowMs,
            };
        }
        if (record.count >= maxAttempts) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: record.resetTime,
            };
        }
        record.count++;
        this.attempts.set(key, record);
        return {
            allowed: true,
            remaining: maxAttempts - record.count,
            resetTime: record.resetTime,
        };
    }
    /**
     * Clear rate limit for a specific identifier
     */
    static clearRateLimit(identifier) {
        this.attempts.delete(identifier);
    }
}
exports.SecurityUtils = SecurityUtils;
