import 'server-only';
import mongoose from 'mongoose';
import { Card } from './types';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DBNAME = process.env.MONGODB_DBNAME || 'singular';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DBNAME
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Thread Schema
const threadSchema = new mongoose.Schema({
  assistantId: { type: String, required: true },
  threadId: { type: String, required: true },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, required: true },
  messages: [
    {
      role: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, required: true }
    }
  ]
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  username: String,
  password: { type: String, required: true },
  hasCompletedOnboarding: { type: Boolean, default: false },
  cardsDetails: {
    data: {
      type: Array,
      default: []
    },
    lastUpdated: { type: Date, default: null }
  }
});

// Create models
export const Thread =
  mongoose.models.Thread || mongoose.model('Thread', threadSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);

// Helper functions
export async function createUser(
  name: string,
  email: string,
  password: string
) {
  try {
    // Ensure database connection
    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await User.create({
      email,
      name,
      username: email,
      password
    });

    return { message: 'User registered successfully' };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  await connectDB();
  return await User.findOne({ email });
}

export async function getUserByUsername(username: string) {
  await connectDB();
  return await User.findOne({ username });
}

// Thread helper functions
export async function createThread(
  assistantId: string,
  threadId: string,
  userEmail: string
) {
  try {
    await connectDB();

    const thread = await Thread.create({
      assistantId,
      threadId,
      userEmail,
      createdAt: new Date(),
      messages: []
    });

    return thread;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
}

export async function getThreadByThreadId(threadId: string) {
  await connectDB();
  return await Thread.findOne({ threadId });
}

export async function getThreadsByUserEmail(userEmail: string) {
  await connectDB();
  return await Thread.find({ userEmail }).sort({ createdAt: -1 });
}

export async function addMessageToThread(
  threadId: string,
  message: { role: string; content: string; timestamp: Date }
) {
  try {
    await connectDB();

    const thread = await Thread.findOneAndUpdate(
      { threadId },
      { $push: { messages: message } },
      { new: true }
    );

    return thread;
  } catch (error) {
    console.error('Error adding message to thread:', error);
    throw error;
  }
}

// User update functions
export async function updateUserPassword(
  email: string,
  hashedPassword: string
) {
  try {
    await connectDB();

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    return user;
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
}

export async function updateUserCardsDetails(
  userId: string,
  data: { data: Card[]; lastUpdated: Date }
) {
  try {
    await connectDB();
    const res = await User.findByIdAndUpdate(userId, {
      cardsDetails: {
        data: data.data,
        lastUpdated: data.lastUpdated
      }
    });
    return res;
  } catch (error) {
    console.error('Error updating user cards details:', error);
    throw error;
  }
}

export { connectDB };
