import app from './src/app.js';
import { initDB } from './db.js';
import { PORT } from './src/config/env.js';

app.listen(PORT, async () => {
  console.log(`\n🚀 Smart Bus Booking Node.js Backend running on http://localhost:${PORT}`);
  await initDB();
});
