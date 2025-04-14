
import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

// Initialize MongoDB connection
export const connectToDatabase = async (): Promise<Db> => {
  if (db) return db;
  
  try {
    const uri = import.meta.env.VITE_MONGO_URI;
    
    if (!uri) {
      throw new Error('MongoDB URI not found in environment variables');
    }
    
    client = new MongoClient(uri);
    await client.connect();
    
    db = client.db();
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

// Get a collection from MongoDB
export async function getCollection(collectionName: string) {
  const db = await connectToDatabase();
  return db.collection(collectionName);
}

// Close MongoDB connection when app is closed
export const closeConnection = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
};

