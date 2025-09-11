import { db } from '../../server/lib/database';
import { users, vehicles, services, bookings, serviceHistory, content, notifications } from './schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import type { 
  User, NewUser, 
  Vehicle, NewVehicle, 
  Service, NewService, 
  Booking, NewBooking,
  ServiceHistoryRecord, NewServiceHistoryRecord,
  Content, NewContent,
  Notification, NewNotification
} from './schema';
import { PasswordUtils } from '../../server/utils/auth';

// User Services
export class UserService {
  static async create(userData: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  /**
   * Create a new user with password hashing
   */
  static async createWithPassword(userData: {
    email: string;
    name: string;
    phone?: string;
    password: string;
    role?: string;
  }): Promise<User> {
    // Check if user already exists
    const existing = await this.findByEmail(userData.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await PasswordUtils.hashPassword(userData.password);

    const newUserData: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'> = {
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      password: hashedPassword,
      role: userData.role || 'customer',
    };

    return await this.create(newUserData);
  }

  /**
   * Authenticate user with email and password
   */
  static async authenticateWithPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.password || !user.isActive) {
      return null;
    }

    const isPasswordValid = await PasswordUtils.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  /**
   * Update user password with proper hashing
   */
  static async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user || !user.password) {
      throw new Error('User not found or has no password');
    }

    // Verify old password
    const isOldPasswordValid = await PasswordUtils.comparePassword(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await PasswordUtils.hashPassword(newPassword);

    // Update user record
    await this.update(userId, { password: hashedNewPassword });
    return true;
  }

  /**
   * Reset password (for admin use or forgot password flow)
   */
  static async resetPassword(userId: string, newPassword: string): Promise<boolean> {
    const hashedPassword = await PasswordUtils.hashPassword(newPassword);
    await this.update(userId, { password: hashedPassword });
    return true;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  static async findById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  static async update(id: string, updates: Partial<NewUser>): Promise<User> {
    const [user] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  static async getAllCustomers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, 'customer'));
  }

  /**
   * Get all users with optional role filtering
   */
  static async getAllUsers(role?: string): Promise<User[]> {
    if (role) {
      return await db.select().from(users).where(eq(users.role, role));
    }
    return await db.select().from(users);
  }

  /**
   * Deactivate user account
   */
  static async deactivateUser(userId: string): Promise<void> {
    await this.update(userId, { isActive: false });
  }

  /**
   * Reactivate user account
   */
  static async reactivateUser(userId: string): Promise<void> {
    await this.update(userId, { isActive: true });
  }

  static async getOrCreateFromGoogle(googleUser: {
    email: string;
    name: string;
    picture?: string;
  }): Promise<User> {
    const existing = await this.findByEmail(googleUser.email);
    if (existing) return existing;

    return await this.create({
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      role: 'customer',
      // Note: No password for Google OAuth users - they authenticate through Google
    });
  }

  /**
   * Remove sensitive data from user object (for API responses)
   */
  static sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

// Vehicle Services
export class VehicleService {
  static async create(vehicleData: Omit<NewVehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    const [vehicle] = await db.insert(vehicles).values(vehicleData).returning();
    return vehicle;
  }

  static async findByUserId(userId: string): Promise<Vehicle[]> {
    return await db.select().from(vehicles)
      .where(and(eq(vehicles.userId, userId), eq(vehicles.isActive, true)))
      .orderBy(desc(vehicles.createdAt));
  }

  static async findById(id: string): Promise<Vehicle | null> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle || null;
  }

  static async update(id: string, updates: Partial<NewVehicle>): Promise<Vehicle> {
    const [vehicle] = await db.update(vehicles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(vehicles.id, id))
      .returning();
    return vehicle;
  }

  static async delete(id: string): Promise<void> {
    await db.update(vehicles)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(vehicles.id, id));
  }
}

// Service Services
export class ServiceService {
  static async getAll(): Promise<Service[]> {
    return await db.select().from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.category), asc(services.name));
  }

  static async findById(id: string): Promise<Service | null> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || null;
  }

  static async getByCategory(category: string): Promise<Service[]> {
    return await db.select().from(services)
      .where(and(eq(services.category, category), eq(services.isActive, true)))
      .orderBy(asc(services.name));
  }

  static async create(serviceData: Omit<NewService, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    const [service] = await db.insert(services).values(serviceData).returning();
    return service;
  }

  static async update(id: string, updates: Partial<NewService>): Promise<Service> {
    const [service] = await db.update(services)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return service;
  }
}

// Booking Services
export class BookingService {
  static async create(bookingData: Omit<NewBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(bookingData).returning();
    return booking;
  }

  static async findByUserId(userId: string): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  static async findById(id: string): Promise<Booking | null> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || null;
  }

  static async updateStatus(id: string, status: string, notes?: string): Promise<Booking> {
    const updateData: any = { status, updatedAt: new Date() };
    if (notes) updateData.technicianNotes = notes;
    if (status === 'completed') updateData.actualCompletion = new Date();

    const [booking] = await db.update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  static async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings)
      .orderBy(desc(bookings.scheduledDate));
  }

  static async getBookingsByStatus(status: string): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.status, status))
      .orderBy(desc(bookings.scheduledDate));
  }
}

// Content Management Services
export class ContentService {
  static async set(key: string, value: string, category: string = 'general', updatedBy?: string): Promise<Content> {
    try {
      const [existing] = await db.select().from(content).where(eq(content.key, key));
      
      if (existing) {
        const [updated] = await db.update(content)
          .set({ value, updatedBy, updatedAt: new Date() })
          .where(eq(content.key, key))
          .returning();
        return updated;
      } else {
        const [created] = await db.insert(content)
          .values({ key, value, category, updatedBy })
          .returning();
        return created;
      }
    } catch (error) {
      console.error('Error setting content:', error);
      throw error;
    }
  }

  static async get(key: string): Promise<string | null> {
    try {
      const [item] = await db.select().from(content)
        .where(and(eq(content.key, key), eq(content.isPublic, true)));
      return item?.value || null;
    } catch (error) {
      console.error('Error getting content:', error);
      return null;
    }
  }

  static async getByCategory(category: string): Promise<Content[]> {
    return await db.select().from(content)
      .where(and(eq(content.category, category), eq(content.isPublic, true)))
      .orderBy(asc(content.key));
  }

  static async getAll(): Promise<Content[]> {
    return await db.select().from(content)
      .orderBy(asc(content.category), asc(content.key));
  }

  static async getPublic(): Promise<Content[]> {
    return await db.select().from(content)
      .where(eq(content.isPublic, true))
      .orderBy(asc(content.category), asc(content.key));
  }
}

// Notification Services
export class NotificationService {
  static async create(notificationData: Omit<NewNotification, 'id' | 'createdAt'>): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(notificationData).returning();
    return notification;
  }

  static async getForUser(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  static async markAsRead(id: string): Promise<void> {
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  static async getUnreadCount(userId: string): Promise<number> {
    const result = await db.select({ count: notifications.id }).from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return result.length;
  }

  static async getById(id: string): Promise<Notification | null> {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification || null;
  }
}

// Service History Services
export class ServiceHistoryService {
  static async create(historyData: Omit<NewServiceHistoryRecord, 'id' | 'createdAt'>): Promise<ServiceHistoryRecord> {
    const [history] = await db.insert(serviceHistory).values(historyData).returning();
    return history;
  }

  static async getForUser(userId: string): Promise<ServiceHistoryRecord[]> {
    return await db.select().from(serviceHistory)
      .where(eq(serviceHistory.userId, userId))
      .orderBy(desc(serviceHistory.completedDate));
  }

  static async getForVehicle(vehicleId: string): Promise<ServiceHistoryRecord[]> {
    return await db.select().from(serviceHistory)
      .where(eq(serviceHistory.vehicleId, vehicleId))
      .orderBy(desc(serviceHistory.completedDate));
  }
}