/**
 * One-time seed script to populate DiningTable collection.
 * Run with: node seedTables.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DiningTable from './models/DiningTable.js';

dotenv.config();

const tables = [
  { tableNumber: 'T1',  capacity: 2, location: 'Indoor',       status: 'Available' },
  { tableNumber: 'T2',  capacity: 2, location: 'Indoor',       status: 'Available' },
  { tableNumber: 'T3',  capacity: 4, location: 'Indoor',       status: 'Available' },
  { tableNumber: 'T4',  capacity: 4, location: 'Indoor',       status: 'Available' },
  { tableNumber: 'T5',  capacity: 6, location: 'Indoor',       status: 'Available' },
  { tableNumber: 'T6',  capacity: 6, location: 'Indoor',       status: 'Available' },
  { tableNumber: 'T7',  capacity: 2, location: 'Outdoor',      status: 'Available' },
  { tableNumber: 'T8',  capacity: 4, location: 'Outdoor',      status: 'Available' },
  { tableNumber: 'T9',  capacity: 4, location: 'Outdoor',      status: 'Available' },
  { tableNumber: 'T10', capacity: 2, location: 'Rooftop',      status: 'Available' },
  { tableNumber: 'T11', capacity: 4, location: 'Rooftop',      status: 'Available' },
  { tableNumber: 'T12', capacity: 8, location: 'Private Room', status: 'Available' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await DiningTable.deleteMany({});
    console.log('Cleared existing tables');

    await DiningTable.insertMany(tables);
    console.log(`Seeded ${tables.length} dining tables successfully!`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
