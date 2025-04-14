
import { MongoClient, ServerApiVersion } from 'mongodb';

// Initialize MongoDB connection
let client: MongoClient | null = null;

export async function connectToDatabase() {
  if (client) {
    return client;
  }
  
  try {
    // Get MongoDB URI from environment variables
    const uri = import.meta.env.VITE_MONGO_URI || 'mongodb://localhost:27017/thrift-trail';
    
    // Create a new MongoDB client
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB successfully");
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

export async function getCollection(collectionName: string) {
  const client = await connectToDatabase();
  const db = client.db();
  return db.collection(collectionName);
}
