import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const fixGuestRoles = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Find all users with role 'admin' but WITHOUT employeeId or department
  // These are guests that were incorrectly promoted
  const wronglyPromoted = await User.find({
    role: 'admin',
    employeeId: { $in: [null, undefined, ''] },
    department: { $in: [null, undefined, ''] },
  });

  console.log(`Found ${wronglyPromoted.length} wrongly promoted guest(s):`);
  wronglyPromoted.forEach(u => console.log(` - ${u.email} (role: ${u.role})`));

  if (wronglyPromoted.length > 0) {
    const result = await User.updateMany(
      {
        role: 'admin',
        employeeId: { $in: [null, undefined, ''] },
        department: { $in: [null, undefined, ''] },
      },
      { $set: { role: 'guest' } }
    );
    console.log(`✅ Fixed ${result.modifiedCount} account(s) — role reset to 'guest'`);
  } else {
    console.log('No wrongly promoted guests found.');
  }

  await mongoose.disconnect();
  console.log('Done!');
};

fixGuestRoles().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
