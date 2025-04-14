
import { getCollection } from './browserStorage';

// This file is now a simple passthrough to browserStorage
// to maintain API compatibility with the original code

export { getCollection };

// No-op function for connection closing
export const closeConnection = async () => {
  // Nothing to close in localStorage implementation
  console.log('Browser storage adapter: no connection to close');
};

// No-op function for connection initialization
export const connectToDatabase = async () => {
  console.log('Using browser storage adapter instead of MongoDB');
  return null;
};
