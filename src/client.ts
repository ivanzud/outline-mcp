import axios from 'axios';
import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { logger } from './utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env') });

const API_KEY = process.env.OUTLINE_API_KEY;
const API_URL = process.env.OUTLINE_API_URL || 'https://app.getoutline.com/api';

if (!API_KEY) {
  process.stderr.write(
    JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'OUTLINE_API_KEY environment variable is required',
      },
    }) + '\n'
  );
  process.exit(1);
}

logger.log(`Connecting to API URL: ${API_URL}`);

// Create axios client with authentication
export const outlineClient = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Type definitions for API responses
export type OutlineUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};
