import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    
    const envVars = envContent
      .split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(line => line.split('='))
      .reduce((acc, [key, value]) => {
        if (key && value) {
          acc[key.trim()] = value.trim();
        }
        return acc;
      }, {});

    // Set environment variables
    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });

    console.log('Environment variables loaded successfully');
  } catch (error) {
    console.error('Error loading environment variables:', error);
    process.exit(1);
  }
}

export default loadEnv;
