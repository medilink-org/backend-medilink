import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Server from './server';
import pjson from '../package.json';

dotenv.config();

const port = Number(process.env.PORT) || 3001;
let mongoUri = process.env.MONGO_DB;

if (process.env.BUILD_ENV === 'production') {
  mongoUri = process.env.MONGO_PROD;
} else if (process.env.BUILD_ENV === 'test') {
  mongoUri = process.env.MONGO_TEST;
}

const { name, version } = pjson;

console.log(`Starting: ${name} | Version: ${version}`);
console.log(`Connecting to MongoDB at: ${mongoUri}`);

if (!mongoUri) {
  throw new Error('MongoDB URI is not defined in environment variables');
}

async function startServer() {
  try {
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at: ${mongoUri}`);

    const server = new Server({ name, version, port });
    server.listen();
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

// Start the server
startServer();

// Handle runtime MongoDB connection errors
const connection = mongoose.connection;
connection.on('error', (err) => {
  console.error('Connection with MongoDB lost:', err);
});

// Handle graceful shutdown on termination signals
process.on('SIGINT', async () => {
  await connection.close();
  console.log('\nMongoDB connection closed');
  process.exit(0);
});
