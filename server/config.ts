// Load environment variables from .env file if present
import fs from 'fs';

try {
  if (fs.existsSync('./.env')) {
    const envFile = fs.readFileSync('./.env', 'utf8');
    const envVars = envFile.split('\n');
    
    envVars.forEach(line => {
      if (line && !line.startsWith('#')) {
        const equalSignIndex = line.indexOf('=');
        if (equalSignIndex > 0) {
          const key = line.substring(0, equalSignIndex);
          // Handle quotes in the value
          let value = line.substring(equalSignIndex + 1);
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          process.env[key] = value;
        }
      }
    });
    
    console.log('Environment variables loaded from .env file');
  } else {
    console.log('No .env file found, using existing environment variables');
  }
} catch (error) {
  console.error('Error loading environment variables:', error);
}

// Export environment variables for use in the application
export const DATABASE_URL = process.env.DATABASE_URL;
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;