import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Database connection
const connection = neon(process.env.DATABASE_URL!);
export const db = drizzle(connection);

// Export the connection for direct queries if needed
export { connection };