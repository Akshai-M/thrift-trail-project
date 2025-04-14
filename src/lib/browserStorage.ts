
import { ObjectId } from 'mongodb';
import { Transaction, TransactionFormData } from './types';

// Browser-compatible storage adapter to replace direct MongoDB usage
export class BrowserStorageAdapter {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.initCollection();
  }

  // Initialize an empty collection if it doesn't exist
  private initCollection(): void {
    if (!localStorage.getItem(this.collectionName)) {
      localStorage.setItem(this.collectionName, JSON.stringify([]));
    }
  }

  // Get all documents from the collection
  async find(): Promise<any[]> {
    const data = localStorage.getItem(this.collectionName);
    return JSON.parse(data || '[]');
  }

  // Insert a document into the collection
  async insertOne(document: any): Promise<void> {
    const collection = await this.find();
    collection.push(document);
    localStorage.setItem(this.collectionName, JSON.stringify(collection));
  }

  // Update a document in the collection
  async updateOne(filter: any, update: any): Promise<void> {
    const collection = await this.find();
    const index = collection.findIndex((item: any) => 
      item._id && filter._id && item._id.toString() === filter._id.toString()
    );
    
    if (index !== -1) {
      // Apply $set updates
      if (update.$set) {
        collection[index] = { ...collection[index], ...update.$set };
      }
      localStorage.setItem(this.collectionName, JSON.stringify(collection));
    }
  }

  // Delete a document from the collection
  async deleteOne(filter: any): Promise<void> {
    const collection = await this.find();
    const filtered = collection.filter((item: any) => 
      item._id && filter._id && item._id.toString() !== filter._id.toString()
    );
    localStorage.setItem(this.collectionName, JSON.stringify(filtered));
  }

  // Convert to array (already an array in this implementation)
  async toArray(): Promise<any[]> {
    return await this.find();
  }
}

// Wrapper to match MongoDB API style
export const getCollection = async (collectionName: string) => {
  return new BrowserStorageAdapter(collectionName);
};

// Generate ObjectId-like strings for compatibility
export const generateObjectId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
