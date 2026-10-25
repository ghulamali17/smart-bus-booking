import app from '../src/app.js';
import { initDB } from '../db.js';

let dbPromise = null;

export default async function handler(req, res) {
  // CORS preflight requests do not need to wait for DB connection
  if (req.method !== 'OPTIONS') {
    if (!dbPromise) {
      dbPromise = initDB().catch((err) => {
        console.error('Cold start DB initialization error:', err);
      });
    }
    await dbPromise;
  }
  return app(req, res);
}
