import cors from 'cors';
import type { CorsOptions } from 'cors';
import { env } from '../config/env.js';

/**
 * CORS strategy:
 * - Always allow non-browser tools (curl/postman) without Origin
 * - Always allow localhost/127.0.0.1 on any port (dev)
 * - Allow any origins listed in CORS_ORIGINS (comma-separated)
 * - Otherwise block
 */
export function corsMiddleware() {
  const options: CorsOptions = {
    origin(origin, cb) {
      // allow non-browser tools (curl/postman) without Origin
      if (!origin) return cb(null, true);

      // allow local dev frontends on any port
      if (/^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
      if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return cb(null, true);

      // allow explicit allowlist from env
      if (env.corsOrigins.includes(origin)) return cb(null, true);

      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  };

  return cors(options);
}
