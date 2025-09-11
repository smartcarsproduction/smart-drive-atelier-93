import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Database connection with error handling
let connection: any;
let db: any;

try {
  if (typeof process !== 'undefined' && process.env.DATABASE_URL) {
    connection = neon(process.env.DATABASE_URL);
    db = drizzle(connection);
    console.log('Database connection established successfully');
  } else {
    console.error('DATABASE_URL not available');
  }
} catch (error) {
  console.error('Database connection failed:', error);
}

export { db, connection };