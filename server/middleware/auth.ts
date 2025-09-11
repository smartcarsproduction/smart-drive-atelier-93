import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../../src/lib/db-services';

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required for security');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// JWT Authentication Middleware
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
      
      // Get fresh user data from database
      const user = await UserService.findById(decoded.sub as string);
      
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
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        res.status(401).json({ error: 'Token expired' });
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        res.status(403).json({ error: 'Invalid token' });
      } else {
        res.status(500).json({ error: 'Token verification failed' });
      }
      return;
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Role-based authorization middleware
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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

// Admin-only authorization
export const requireAdmin = authorizeRoles('admin');

// Customer or Admin authorization
export const requireCustomerOrAdmin = authorizeRoles('customer', 'admin');

// Optional authentication (for routes that can work with or without auth)
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const user = await UserService.findById(decoded.sub as string);
    
    if (user && user.isActive) {
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log('Optional auth failed:', error);
  }

  next();
};

// Export the extended Request interface for use in routes
export { AuthenticatedRequest };