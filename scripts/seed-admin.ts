import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import { users } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

// Connect to database
const connection = postgres(process.env.DATABASE_URL!);
const db = drizzle(connection);

async function seedAdmin() {
  try {
    console.log('🔧 Seeding admin user...');
    
    // Hash the admin password
    const adminPassword = 'Admin123!'; // Strong password that meets requirements
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Check if admin exists and update password, or create new admin
    const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin@smartcars.com')).limit(1);
    
    if (existingAdmin.length > 0) {
      // Update existing admin password
      await db.update(users)
        .set({ 
          password: hashedPassword,
          isActive: true,
          role: 'admin'
        })
        .where(eq(users.email, 'admin@smartcars.com'));
      
      console.log('✅ Updated existing admin user password');
    } else {
      // Create new admin user
      await db.insert(users).values({
        email: 'admin@smartcars.com',
        name: 'System Administrator',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });
      
      console.log('✅ Created new admin user');
    }
    
    console.log('📧 Admin Email: admin@smartcars.com');
    console.log('🔑 Admin Password: Admin123!');
    console.log('🎯 You can now log in to the admin dashboard');
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedAdmin();