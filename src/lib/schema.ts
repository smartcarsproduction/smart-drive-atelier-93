import { pgTable, text, timestamp, uuid, boolean, integer, decimal, jsonb, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table - stores both regular users and admin users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  password: text('password'), // Hashed password - nullable for Google OAuth users
  picture: text('picture'), // For Google OAuth profile pictures
  role: text('role').notNull().default('customer'), // 'customer', 'admin', 'technician'
  isActive: boolean('is_active').default(true),
  preferences: jsonb('preferences'), // Service preferences, notifications, etc.
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Vehicles table - luxury vehicles owned by customers
export const vehicles = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  make: text('make').notNull(), // Mercedes-Benz, BMW, etc.
  model: text('model').notNull(),
  year: integer('year').notNull(),
  vin: text('vin'),
  color: text('color'),
  mileage: integer('mileage'),
  fuelType: text('fuel_type'), // gasoline, diesel, electric, hybrid
  transmission: text('transmission'), // automatic, manual
  engineSize: text('engine_size'),
  notes: text('notes'), // Special notes about the vehicle
  nextServiceDue: timestamp('next_service_due'), // When the next service is due
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Services table - available luxury car services
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(), // 'maintenance', 'detailing', 'diagnostics', 'customization'
  price: decimal('price', { precision: 10, scale: 2 }),
  estimatedDuration: integer('estimated_duration'), // in minutes
  isActive: boolean('is_active').default(true),
  requiresPickup: boolean('requires_pickup').default(false),
  luxuryLevel: text('luxury_level').default('standard'), // 'standard', 'premium', 'elite'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Bookings table - customer service appointments
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  vehicleId: uuid('vehicle_id').references(() => vehicles.id).notNull(),
  serviceId: uuid('service_id').references(() => services.id).notNull(),
  status: text('status').notNull().default('pending'), // 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
  scheduledDate: timestamp('scheduled_date').notNull(),
  estimatedCompletion: timestamp('estimated_completion'),
  actualCompletion: timestamp('actual_completion'),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }),
  notes: text('notes'), // Customer notes or special requests
  technicianNotes: text('technician_notes'), // Internal notes from technicians
  pickupAddress: text('pickup_address'), // For pickup/delivery services
  deliveryAddress: text('delivery_address'),
  priority: text('priority').default('normal'), // 'low', 'normal', 'high', 'urgent'
  completionCallTriggered: boolean('completion_call_triggered').default(false), // Track if voice call was made
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Service history table - completed services for analytics and history
export const serviceHistory = pgTable('service_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').references(() => bookings.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  vehicleId: uuid('vehicle_id').references(() => vehicles.id).notNull(),
  serviceId: uuid('service_id').references(() => services.id).notNull(),
  completedDate: timestamp('completed_date').notNull(),
  rating: integer('rating'), // 1-5 star rating
  review: text('review'), // Customer review
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }),
  technicianId: uuid('technician_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Content management table - for dynamic website content
export const content = pgTable('content', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(), // e.g., 'hero_title', 'contact_phone'
  value: text('value').notNull(),
  category: text('category').notNull(), // 'general', 'services', 'contact', 'about'
  isPublic: boolean('is_public').default(true),
  updatedBy: uuid('updated_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Notifications table - for customer and admin notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(), // 'booking_confirmed', 'service_completed', 'reminder', 'promotion'
  title: text('title').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  relatedBookingId: uuid('related_booking_id').references(() => bookings.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Time slots table - for booking availability management
export const timeSlots = pgTable('time_slots', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: timestamp('date').notNull(), // The date of the time slot
  startTime: text('start_time').notNull(), // Start time (e.g., "09:00")
  endTime: text('end_time').notNull(), // End time (e.g., "10:00")
  isAvailable: boolean('is_available').default(true),
  bookedBy: uuid('booked_by').references(() => bookings.id), // Reference to booking if slot is taken
  maxCapacity: integer('max_capacity').default(1), // How many bookings this slot can handle
  currentBookings: integer('current_bookings').default(0), // Current number of bookings
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Define relationships for better querying
export const usersRelations = relations(users, ({ many }) => ({
  vehicles: many(vehicles),
  bookings: many(bookings),
  serviceHistory: many(serviceHistory),
  notifications: many(notifications),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  user: one(users, {
    fields: [vehicles.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
  serviceHistory: many(serviceHistory),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  bookings: many(bookings),
  serviceHistory: many(serviceHistory),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  vehicle: one(vehicles, {
    fields: [bookings.vehicleId],
    references: [vehicles.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
}));

export const serviceHistoryRelations = relations(serviceHistory, ({ one }) => ({
  booking: one(bookings, {
    fields: [serviceHistory.bookingId],
    references: [bookings.id],
  }),
  user: one(users, {
    fields: [serviceHistory.userId],
    references: [users.id],
  }),
  vehicle: one(vehicles, {
    fields: [serviceHistory.vehicleId],
    references: [vehicles.id],
  }),
  service: one(services, {
    fields: [serviceHistory.serviceId],
    references: [services.id],
  }),
  technician: one(users, {
    fields: [serviceHistory.technicianId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  relatedBooking: one(bookings, {
    fields: [notifications.relatedBookingId],
    references: [bookings.id],
  }),
}));

export const timeSlotsRelations = relations(timeSlots, ({ one }) => ({
  booking: one(bookings, {
    fields: [timeSlots.bookedBy],
    references: [bookings.id],
  }),
}));

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type ServiceHistoryRecord = typeof serviceHistory.$inferSelect;
export type NewServiceHistoryRecord = typeof serviceHistory.$inferInsert;
export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type TimeSlot = typeof timeSlots.$inferSelect;
export type NewTimeSlot = typeof timeSlots.$inferInsert;