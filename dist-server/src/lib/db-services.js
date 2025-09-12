"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotsService = exports.ServiceHistoryService = exports.NotificationService = exports.ContentService = exports.BookingService = exports.ServiceService = exports.VehicleService = exports.UserService = void 0;
const database_1 = require("../../server/lib/database");
const schema_1 = require("./schema");
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../../server/utils/auth");
// User Services
class UserService {
    static async create(userData) {
        const [user] = await database_1.db.insert(schema_1.users).values(userData).returning();
        return user;
    }
    /**
     * Create a new user with password hashing
     */
    static async createWithPassword(userData) {
        // Check if user already exists
        const existing = await this.findByEmail(userData.email);
        if (existing) {
            throw new Error('User with this email already exists');
        }
        // Hash the password
        const hashedPassword = await auth_1.PasswordUtils.hashPassword(userData.password);
        const newUserData = {
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
    static async authenticateWithPassword(email, password) {
        const user = await this.findByEmail(email);
        if (!user || !user.password || !user.isActive) {
            return null;
        }
        const isPasswordValid = await auth_1.PasswordUtils.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    /**
     * Update user password with proper hashing
     */
    static async updatePassword(userId, oldPassword, newPassword) {
        const user = await this.findById(userId);
        if (!user || !user.password) {
            throw new Error('User not found or has no password');
        }
        // Verify old password
        const isOldPasswordValid = await auth_1.PasswordUtils.comparePassword(oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        // Hash new password
        const hashedNewPassword = await auth_1.PasswordUtils.hashPassword(newPassword);
        // Update user record
        await this.update(userId, { password: hashedNewPassword });
        return true;
    }
    /**
     * Reset password (for admin use or forgot password flow)
     */
    static async resetPassword(userId, newPassword) {
        const hashedPassword = await auth_1.PasswordUtils.hashPassword(newPassword);
        await this.update(userId, { password: hashedPassword });
        return true;
    }
    static async findByEmail(email) {
        const [user] = await database_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        return user || null;
    }
    static async findById(id) {
        const [user] = await database_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        return user || null;
    }
    static async update(id, updates) {
        const [user] = await database_1.db.update(schema_1.users)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
            .returning();
        return user;
    }
    static async getAllCustomers() {
        return await database_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.role, 'customer'));
    }
    /**
     * Get all users with optional role filtering
     */
    static async getAllUsers(role) {
        if (role) {
            return await database_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.role, role));
        }
        return await database_1.db.select().from(schema_1.users);
    }
    /**
     * Deactivate user account
     */
    static async deactivateUser(userId) {
        await this.update(userId, { isActive: false });
    }
    /**
     * Reactivate user account
     */
    static async reactivateUser(userId) {
        await this.update(userId, { isActive: true });
    }
    static async getOrCreateFromGoogle(googleUser) {
        const existing = await this.findByEmail(googleUser.email);
        if (existing)
            return existing;
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
    static sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}
exports.UserService = UserService;
// Vehicle Services
class VehicleService {
    static async create(vehicleData) {
        const [vehicle] = await database_1.db.insert(schema_1.vehicles).values(vehicleData).returning();
        return vehicle;
    }
    static async findByUserId(userId) {
        return await database_1.db.select().from(schema_1.vehicles)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.vehicles.userId, userId), (0, drizzle_orm_1.eq)(schema_1.vehicles.isActive, true)))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.vehicles.createdAt));
    }
    static async findById(id) {
        const [vehicle] = await database_1.db.select().from(schema_1.vehicles).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, id));
        return vehicle || null;
    }
    static async update(id, updates) {
        const [vehicle] = await database_1.db.update(schema_1.vehicles)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, id))
            .returning();
        return vehicle;
    }
    static async delete(id) {
        await database_1.db.update(schema_1.vehicles)
            .set({ isActive: false, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, id));
    }
}
exports.VehicleService = VehicleService;
// Service Services
class ServiceService {
    static async getAll() {
        return await database_1.db.select().from(schema_1.services)
            .where((0, drizzle_orm_1.eq)(schema_1.services.isActive, true))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.services.category), (0, drizzle_orm_1.asc)(schema_1.services.name));
    }
    static async findById(id) {
        const [service] = await database_1.db.select().from(schema_1.services).where((0, drizzle_orm_1.eq)(schema_1.services.id, id));
        return service || null;
    }
    static async getByCategory(category) {
        return await database_1.db.select().from(schema_1.services)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.services.category, category), (0, drizzle_orm_1.eq)(schema_1.services.isActive, true)))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.services.name));
    }
    static async create(serviceData) {
        const [service] = await database_1.db.insert(schema_1.services).values(serviceData).returning();
        return service;
    }
    static async update(id, updates) {
        const [service] = await database_1.db.update(schema_1.services)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.services.id, id))
            .returning();
        return service;
    }
}
exports.ServiceService = ServiceService;
// Booking Services
class BookingService {
    static async create(bookingData) {
        const [booking] = await database_1.db.insert(schema_1.bookings).values(bookingData).returning();
        return booking;
    }
    static async findByUserId(userId) {
        return await database_1.db.select().from(schema_1.bookings)
            .where((0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.bookings.createdAt));
    }
    static async findById(id) {
        const [booking] = await database_1.db.select().from(schema_1.bookings).where((0, drizzle_orm_1.eq)(schema_1.bookings.id, id));
        return booking || null;
    }
    static async updateStatus(id, status, notes, completionCallTriggered) {
        const updateData = { status, updatedAt: new Date() };
        if (notes)
            updateData.technicianNotes = notes;
        if (status === 'completed')
            updateData.actualCompletion = new Date();
        if (completionCallTriggered !== undefined)
            updateData.completionCallTriggered = completionCallTriggered;
        const [booking] = await database_1.db.update(schema_1.bookings)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.bookings.id, id))
            .returning();
        return booking;
    }
    static async getAllBookings() {
        return await database_1.db.select().from(schema_1.bookings)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.bookings.scheduledDate));
    }
    static async getBookingsByStatus(status) {
        return await database_1.db.select().from(schema_1.bookings)
            .where((0, drizzle_orm_1.eq)(schema_1.bookings.status, status))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.bookings.scheduledDate));
    }
    static async findByVehicleId(vehicleId) {
        return await database_1.db.select().from(schema_1.bookings)
            .where((0, drizzle_orm_1.eq)(schema_1.bookings.vehicleId, vehicleId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.bookings.scheduledDate));
    }
    static async getUpcomingBookingsForVehicle(vehicleId) {
        const now = new Date();
        return await database_1.db.select().from(schema_1.bookings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.vehicleId, vehicleId), (0, drizzle_orm_1.gte)(schema_1.bookings.scheduledDate, now), (0, drizzle_orm_1.eq)(schema_1.bookings.status, 'confirmed')))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.bookings.scheduledDate));
    }
}
exports.BookingService = BookingService;
// Content Management Services
class ContentService {
    static async set(key, value, category = 'general', updatedBy) {
        try {
            const [existing] = await database_1.db.select().from(schema_1.content).where((0, drizzle_orm_1.eq)(schema_1.content.key, key));
            if (existing) {
                const [updated] = await database_1.db.update(schema_1.content)
                    .set({ value, updatedBy, updatedAt: new Date() })
                    .where((0, drizzle_orm_1.eq)(schema_1.content.key, key))
                    .returning();
                return updated;
            }
            else {
                const [created] = await database_1.db.insert(schema_1.content)
                    .values({ key, value, category, updatedBy })
                    .returning();
                return created;
            }
        }
        catch (error) {
            console.error('Error setting content:', error);
            throw error;
        }
    }
    static async get(key) {
        try {
            const [item] = await database_1.db.select().from(schema_1.content)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.content.key, key), (0, drizzle_orm_1.eq)(schema_1.content.isPublic, true)));
            return item?.value || null;
        }
        catch (error) {
            console.error('Error getting content:', error);
            return null;
        }
    }
    static async getByCategory(category) {
        return await database_1.db.select().from(schema_1.content)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.content.category, category), (0, drizzle_orm_1.eq)(schema_1.content.isPublic, true)))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.content.key));
    }
    static async getAll() {
        return await database_1.db.select().from(schema_1.content)
            .orderBy((0, drizzle_orm_1.asc)(schema_1.content.category), (0, drizzle_orm_1.asc)(schema_1.content.key));
    }
    static async getPublic() {
        return await database_1.db.select().from(schema_1.content)
            .where((0, drizzle_orm_1.eq)(schema_1.content.isPublic, true))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.content.category), (0, drizzle_orm_1.asc)(schema_1.content.key));
    }
}
exports.ContentService = ContentService;
// Notification Services
class NotificationService {
    static async create(notificationData) {
        const [notification] = await database_1.db.insert(schema_1.notifications).values(notificationData).returning();
        return notification;
    }
    static async getForUser(userId) {
        return await database_1.db.select().from(schema_1.notifications)
            .where((0, drizzle_orm_1.eq)(schema_1.notifications.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.notifications.createdAt));
    }
    static async markAsRead(id) {
        await database_1.db.update(schema_1.notifications)
            .set({ isRead: true })
            .where((0, drizzle_orm_1.eq)(schema_1.notifications.id, id));
    }
    static async getUnreadCount(userId) {
        const result = await database_1.db.select({ count: schema_1.notifications.id }).from(schema_1.notifications)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.userId, userId), (0, drizzle_orm_1.eq)(schema_1.notifications.isRead, false)));
        return result.length;
    }
    static async getById(id) {
        const [notification] = await database_1.db.select().from(schema_1.notifications).where((0, drizzle_orm_1.eq)(schema_1.notifications.id, id));
        return notification || null;
    }
}
exports.NotificationService = NotificationService;
// Service History Services
class ServiceHistoryService {
    static async create(historyData) {
        const [history] = await database_1.db.insert(schema_1.serviceHistory).values(historyData).returning();
        return history;
    }
    static async getForUser(userId) {
        return await database_1.db.select().from(schema_1.serviceHistory)
            .where((0, drizzle_orm_1.eq)(schema_1.serviceHistory.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.serviceHistory.completedDate));
    }
    static async getForVehicle(vehicleId) {
        return await database_1.db.select().from(schema_1.serviceHistory)
            .where((0, drizzle_orm_1.eq)(schema_1.serviceHistory.vehicleId, vehicleId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.serviceHistory.completedDate));
    }
}
exports.ServiceHistoryService = ServiceHistoryService;
// Time Slots Services
class TimeSlotsService {
    static async create(slotData) {
        const [timeSlot] = await database_1.db.insert(schema_1.timeSlots).values(slotData).returning();
        return timeSlot;
    }
    static async getAvailableSlots(date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return await database_1.db.select().from(schema_1.timeSlots)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.timeSlots.date, startOfDay), (0, drizzle_orm_1.lte)(schema_1.timeSlots.date, endOfDay), (0, drizzle_orm_1.eq)(schema_1.timeSlots.isAvailable, true), (0, drizzle_orm_1.lt)(schema_1.timeSlots.currentBookings, schema_1.timeSlots.maxCapacity)))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.timeSlots.startTime));
    }
    static async getSlotsInRange(startDate, endDate) {
        return await database_1.db.select().from(schema_1.timeSlots)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.timeSlots.date, startDate), (0, drizzle_orm_1.lte)(schema_1.timeSlots.date, endDate)))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.timeSlots.date), (0, drizzle_orm_1.asc)(schema_1.timeSlots.startTime));
    }
    static async bookSlot(timeSlotId, bookingId) {
        try {
            // Start a transaction to prevent double booking
            const [slot] = await database_1.db.select().from(schema_1.timeSlots)
                .where((0, drizzle_orm_1.eq)(schema_1.timeSlots.id, timeSlotId));
            if (!slot) {
                throw new Error('Time slot not found');
            }
            // Check if slot is still available (double-booking prevention)
            if (!slot.isAvailable || slot.currentBookings >= slot.maxCapacity) {
                return false;
            }
            // Update slot with booking
            const newCurrentBookings = slot.currentBookings + 1;
            const shouldMarkUnavailable = newCurrentBookings >= slot.maxCapacity;
            await database_1.db.update(schema_1.timeSlots)
                .set({
                bookedBy: bookingId,
                currentBookings: newCurrentBookings,
                isAvailable: !shouldMarkUnavailable,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_1.timeSlots.id, timeSlotId));
            return true;
        }
        catch (error) {
            console.error('Error booking slot:', error);
            return false;
        }
    }
    static async releaseSlot(timeSlotId) {
        try {
            const [slot] = await database_1.db.select().from(schema_1.timeSlots)
                .where((0, drizzle_orm_1.eq)(schema_1.timeSlots.id, timeSlotId));
            if (!slot) {
                return false;
            }
            const newCurrentBookings = Math.max(0, slot.currentBookings - 1);
            await database_1.db.update(schema_1.timeSlots)
                .set({
                bookedBy: null,
                currentBookings: newCurrentBookings,
                isAvailable: true,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_1.timeSlots.id, timeSlotId));
            return true;
        }
        catch (error) {
            console.error('Error releasing slot:', error);
            return false;
        }
    }
    static async generateSlots(options) {
        const { startDate, endDate, startTime, endTime, slotDuration, maxCapacity = 1 } = options;
        const slots = [];
        // Parse start and end times
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        // Generate slots for each day in the range
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            // Generate time slots for this day
            let currentSlotStart = new Date(currentDate);
            currentSlotStart.setHours(startHour, startMinute, 0, 0);
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(endHour, endMinute, 0, 0);
            while (currentSlotStart < dayEnd) {
                const slotEnd = new Date(currentSlotStart);
                slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);
                if (slotEnd <= dayEnd) {
                    const slotData = {
                        date: new Date(currentSlotStart),
                        startTime: currentSlotStart.toTimeString().substring(0, 5),
                        endTime: slotEnd.toTimeString().substring(0, 5),
                        maxCapacity,
                        currentBookings: 0,
                        isAvailable: true,
                    };
                    const createdSlot = await this.create(slotData);
                    slots.push(createdSlot);
                }
                currentSlotStart = new Date(slotEnd);
            }
            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return slots;
    }
    static async findById(id) {
        const [slot] = await database_1.db.select().from(schema_1.timeSlots).where((0, drizzle_orm_1.eq)(schema_1.timeSlots.id, id));
        return slot || null;
    }
    static async getSlotsByBooking(bookingId) {
        return await database_1.db.select().from(schema_1.timeSlots)
            .where((0, drizzle_orm_1.eq)(schema_1.timeSlots.bookedBy, bookingId));
    }
    static async deleteSlot(id) {
        await database_1.db.delete(schema_1.timeSlots).where((0, drizzle_orm_1.eq)(schema_1.timeSlots.id, id));
    }
}
exports.TimeSlotsService = TimeSlotsService;
