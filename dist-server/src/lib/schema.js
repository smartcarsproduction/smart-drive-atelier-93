"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeSlotsRelations = exports.notificationsRelations = exports.serviceHistoryRelations = exports.bookingsRelations = exports.servicesRelations = exports.vehiclesRelations = exports.usersRelations = exports.timeSlots = exports.notifications = exports.content = exports.serviceHistory = exports.bookings = exports.services = exports.vehicles = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// Users table - stores both regular users and admin users
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    name: (0, pg_core_1.text)('name').notNull(),
    phone: (0, pg_core_1.text)('phone'),
    password: (0, pg_core_1.text)('password'), // Hashed password - nullable for Google OAuth users
    picture: (0, pg_core_1.text)('picture'), // For Google OAuth profile pictures
    role: (0, pg_core_1.text)('role').notNull().default('customer'), // 'customer', 'admin', 'technician'
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    preferences: (0, pg_core_1.jsonb)('preferences'), // Service preferences, notifications, etc.
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
// Vehicles table - luxury vehicles owned by customers
exports.vehicles = (0, pg_core_1.pgTable)('vehicles', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    make: (0, pg_core_1.text)('make').notNull(), // Mercedes-Benz, BMW, etc.
    model: (0, pg_core_1.text)('model').notNull(),
    year: (0, pg_core_1.integer)('year').notNull(),
    vin: (0, pg_core_1.text)('vin'),
    color: (0, pg_core_1.text)('color'),
    mileage: (0, pg_core_1.integer)('mileage'),
    fuelType: (0, pg_core_1.text)('fuel_type'), // gasoline, diesel, electric, hybrid
    transmission: (0, pg_core_1.text)('transmission'), // automatic, manual
    engineSize: (0, pg_core_1.text)('engine_size'),
    notes: (0, pg_core_1.text)('notes'), // Special notes about the vehicle
    nextServiceDue: (0, pg_core_1.timestamp)('next_service_due'), // When the next service is due
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
// Services table - available luxury car services
exports.services = (0, pg_core_1.pgTable)('services', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)('name').notNull(),
    description: (0, pg_core_1.text)('description'),
    category: (0, pg_core_1.text)('category').notNull(), // 'maintenance', 'detailing', 'diagnostics', 'customization'
    price: (0, pg_core_1.decimal)('price', { precision: 10, scale: 2 }),
    estimatedDuration: (0, pg_core_1.integer)('estimated_duration'), // in minutes
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    requiresPickup: (0, pg_core_1.boolean)('requires_pickup').default(false),
    luxuryLevel: (0, pg_core_1.text)('luxury_level').default('standard'), // 'standard', 'premium', 'elite'
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
// Bookings table - customer service appointments
exports.bookings = (0, pg_core_1.pgTable)('bookings', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    vehicleId: (0, pg_core_1.uuid)('vehicle_id').references(() => exports.vehicles.id).notNull(),
    serviceId: (0, pg_core_1.uuid)('service_id').references(() => exports.services.id).notNull(),
    status: (0, pg_core_1.text)('status').notNull().default('pending'), // 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
    scheduledDate: (0, pg_core_1.timestamp)('scheduled_date').notNull(),
    estimatedCompletion: (0, pg_core_1.timestamp)('estimated_completion'),
    actualCompletion: (0, pg_core_1.timestamp)('actual_completion'),
    totalPrice: (0, pg_core_1.decimal)('total_price', { precision: 10, scale: 2 }),
    notes: (0, pg_core_1.text)('notes'), // Customer notes or special requests
    technicianNotes: (0, pg_core_1.text)('technician_notes'), // Internal notes from technicians
    pickupAddress: (0, pg_core_1.text)('pickup_address'), // For pickup/delivery services
    deliveryAddress: (0, pg_core_1.text)('delivery_address'),
    priority: (0, pg_core_1.text)('priority').default('normal'), // 'low', 'normal', 'high', 'urgent'
    completionCallTriggered: (0, pg_core_1.boolean)('completion_call_triggered').default(false), // Track if voice call was made
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
// Service history table - completed services for analytics and history
exports.serviceHistory = (0, pg_core_1.pgTable)('service_history', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    bookingId: (0, pg_core_1.uuid)('booking_id').references(() => exports.bookings.id).notNull(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    vehicleId: (0, pg_core_1.uuid)('vehicle_id').references(() => exports.vehicles.id).notNull(),
    serviceId: (0, pg_core_1.uuid)('service_id').references(() => exports.services.id).notNull(),
    completedDate: (0, pg_core_1.timestamp)('completed_date').notNull(),
    rating: (0, pg_core_1.integer)('rating'), // 1-5 star rating
    review: (0, pg_core_1.text)('review'), // Customer review
    totalPrice: (0, pg_core_1.decimal)('total_price', { precision: 10, scale: 2 }),
    technicianId: (0, pg_core_1.uuid)('technician_id').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
// Content management table - for dynamic website content
exports.content = (0, pg_core_1.pgTable)('content', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    key: (0, pg_core_1.text)('key').notNull().unique(), // e.g., 'hero_title', 'contact_phone'
    value: (0, pg_core_1.text)('value').notNull(),
    category: (0, pg_core_1.text)('category').notNull(), // 'general', 'services', 'contact', 'about'
    isPublic: (0, pg_core_1.boolean)('is_public').default(true),
    updatedBy: (0, pg_core_1.uuid)('updated_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
// Notifications table - for customer and admin notifications
exports.notifications = (0, pg_core_1.pgTable)('notifications', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    type: (0, pg_core_1.text)('type').notNull(), // 'booking_confirmed', 'service_completed', 'reminder', 'promotion'
    title: (0, pg_core_1.text)('title').notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    isRead: (0, pg_core_1.boolean)('is_read').default(false),
    relatedBookingId: (0, pg_core_1.uuid)('related_booking_id').references(() => exports.bookings.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
// Time slots table - for booking availability management
exports.timeSlots = (0, pg_core_1.pgTable)('time_slots', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    date: (0, pg_core_1.timestamp)('date').notNull(), // The date of the time slot
    startTime: (0, pg_core_1.text)('start_time').notNull(), // Start time (e.g., "09:00")
    endTime: (0, pg_core_1.text)('end_time').notNull(), // End time (e.g., "10:00")
    isAvailable: (0, pg_core_1.boolean)('is_available').default(true),
    bookedBy: (0, pg_core_1.uuid)('booked_by').references(() => exports.bookings.id), // Reference to booking if slot is taken
    maxCapacity: (0, pg_core_1.integer)('max_capacity').default(1), // How many bookings this slot can handle
    currentBookings: (0, pg_core_1.integer)('current_bookings').default(0), // Current number of bookings
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
// Define relationships for better querying
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    vehicles: many(exports.vehicles),
    bookings: many(exports.bookings),
    serviceHistory: many(exports.serviceHistory),
    notifications: many(exports.notifications),
}));
exports.vehiclesRelations = (0, drizzle_orm_1.relations)(exports.vehicles, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.vehicles.userId],
        references: [exports.users.id],
    }),
    bookings: many(exports.bookings),
    serviceHistory: many(exports.serviceHistory),
}));
exports.servicesRelations = (0, drizzle_orm_1.relations)(exports.services, ({ many }) => ({
    bookings: many(exports.bookings),
    serviceHistory: many(exports.serviceHistory),
}));
exports.bookingsRelations = (0, drizzle_orm_1.relations)(exports.bookings, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.bookings.userId],
        references: [exports.users.id],
    }),
    vehicle: one(exports.vehicles, {
        fields: [exports.bookings.vehicleId],
        references: [exports.vehicles.id],
    }),
    service: one(exports.services, {
        fields: [exports.bookings.serviceId],
        references: [exports.services.id],
    }),
}));
exports.serviceHistoryRelations = (0, drizzle_orm_1.relations)(exports.serviceHistory, ({ one }) => ({
    booking: one(exports.bookings, {
        fields: [exports.serviceHistory.bookingId],
        references: [exports.bookings.id],
    }),
    user: one(exports.users, {
        fields: [exports.serviceHistory.userId],
        references: [exports.users.id],
    }),
    vehicle: one(exports.vehicles, {
        fields: [exports.serviceHistory.vehicleId],
        references: [exports.vehicles.id],
    }),
    service: one(exports.services, {
        fields: [exports.serviceHistory.serviceId],
        references: [exports.services.id],
    }),
    technician: one(exports.users, {
        fields: [exports.serviceHistory.technicianId],
        references: [exports.users.id],
    }),
}));
exports.notificationsRelations = (0, drizzle_orm_1.relations)(exports.notifications, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.notifications.userId],
        references: [exports.users.id],
    }),
    relatedBooking: one(exports.bookings, {
        fields: [exports.notifications.relatedBookingId],
        references: [exports.bookings.id],
    }),
}));
exports.timeSlotsRelations = (0, drizzle_orm_1.relations)(exports.timeSlots, ({ one }) => ({
    booking: one(exports.bookings, {
        fields: [exports.timeSlots.bookedBy],
        references: [exports.bookings.id],
    }),
}));
