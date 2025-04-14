
// This is a browser-compatible storage adapter
// In a real application, this would be replaced with an API call to a backend

/**
 * A simplified storage system that works in the browser
 * This mimics some of the MongoDB API but uses localStorage
 */
export class BrowserStorageAdapter {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    // Initialize the collection if it doesn't exist
    if (!localStorage.getItem(this.collectionName)) {
      localStorage.setItem(this.collectionName, JSON.stringify([]));
    }
  }

  async find(query = {}) {
    // Simple implementation that ignores query and returns all items
    return {
      toArray: async () => {
        const data = localStorage.getItem(this.collectionName) || '[]';
        return JSON.parse(data);
      }
    };
  }

  async insertOne(document: Record<string, any>) {
    const collection = JSON.parse(localStorage.getItem(this.collectionName) || '[]');
    collection.push(document);
    localStorage.setItem(this.collectionName, JSON.stringify(collection));
    return { insertedId: document._id };
  }

  async updateOne(filter: { _id: string }, update: { $set: Record<string, any> }) {
    const collection = JSON.parse(localStorage.getItem(this.collectionName) || '[]');
    const index = collection.findIndex((item: any) => item._id === filter._id);
    
    if (index !== -1) {
      collection[index] = { ...collection[index], ...update.$set };
      localStorage.setItem(this.collectionName, JSON.stringify(collection));
    }
    
    return { modifiedCount: index !== -1 ? 1 : 0 };
  }

  async deleteOne(filter: { _id: string }) {
    const collection = JSON.parse(localStorage.getItem(this.collectionName) || '[]');
    const filtered = collection.filter((item: any) => item._id !== filter._id);
    localStorage.setItem(this.collectionName, JSON.stringify(filtered));
    return { deletedCount: collection.length - filtered.length };
  }
}

/**
 * Get a collection from browser storage
 */
export async function getCollection(collectionName: string) {
  return new BrowserStorageAdapter(collectionName);
}

