import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required for security');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const BCRYPT_ROUNDS = 12;

// Password hashing utilities
export class PasswordUtils {
  /**
   * Hash a password using bcrypt with salt rounds
   */
  static async hashPassword(password: string): Promise<string> {
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  /**
   * Compare a plain text password with a hashed password
   */
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    score: number;
  } {
    const errors: string[] = [];
    let score = 0;

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else {
      score += 1;
    }

    return {
      isValid: errors.length === 0,
      errors,
      score
    };
  }
}

// JWT token utilities
export class TokenUtils {
  /**
   * Generate a JWT token for a user
   */
  static generateToken(payload: {
    id: string;
    email: string;
    role: string;
  }): string {
    return jwt.sign(
      {
        sub: payload.id,
        email: payload.email,
        role: payload.role,
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'smart-cars-elite',
        audience: 'smart-cars-users',
      } as jwt.SignOptions
    );
  }

  /**
   * Generate a refresh token with longer expiration
   */
  static generateRefreshToken(userId: string): string {
    return jwt.sign(
      {
        sub: userId,
        type: 'refresh',
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      {
        expiresIn: '7d',
        issuer: 'smart-cars-elite',
        audience: 'smart-cars-users',
      } as jwt.SignOptions
    );
  }

  /**
   * Verify and decode a JWT token
   */
  static verifyToken(token: string): jwt.JwtPayload {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'smart-cars-elite',
      audience: 'smart-cars-users',
    }) as jwt.JwtPayload;
  }

  /**
   * Decode token without verification (for expired token handling)
   */
  static decodeToken(token: string): jwt.JwtPayload | null {
    try {
      return jwt.decode(token) as jwt.JwtPayload;
    } catch {
      return null;
    }
  }

  /**
   * Generate access and refresh token pair
   */
  static generateTokenPair(user: {
    id: string;
    email: string;
    role: string;
  }): {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  } {
    const accessToken = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      expiresIn: JWT_EXPIRES_IN,
    };
  }
}

// Authentication response utilities
export class AuthResponse {
  /**
   * Generate a standardized auth success response
   */
  static success(user: {
    id: string;
    email: string;
    name: string;
    role: string;
    picture?: string | null;
  }) {
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
  static error(message: string, code: string = 'AUTH_ERROR') {
    return {
      error: message,
      code,
      timestamp: new Date().toISOString(),
    };
  }
}

// Security utilities
export class SecurityUtils {
  /**
   * Generate a secure random string for various uses
   */
  static generateSecureRandom(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Rate limiting helper - basic implementation
   */
  private static attempts: Map<string, { count: number; resetTime: number }> = new Map();

  static checkRateLimit(
    identifier: string,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): { allowed: boolean; remaining: number; resetTime: number } {
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
  static clearRateLimit(identifier: string): void {
    this.attempts.delete(identifier);
  }
}