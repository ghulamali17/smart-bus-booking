import app from '../src/app.js';
import { initDB } from '../db.js';

let dbReady = false;

export default async function handler(req, res) {
  if (!dbReady) {
    try {
      await initDB();
      dbReady = true;
    } catch (e) {
      console.error('Cold start DB connection error:', e);
    }
  }
  return app(req, res);
}
