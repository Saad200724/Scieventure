// IndexedDB storage service for offline content
// This supports storing large files like PDFs and videos

// Define the OfflineContent type
export interface OfflineContent {
  id: number;
  title: string;
  description: string;
  subject: string;
  fileSize: string;
  thumbnail: string;
  downloadDate: string;
  url: string;
  type: 'document' | 'video';
  data?: Blob; // The actual file content
}

// Initialize the IndexedDB database
export const initializeOfflineStorage = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if IndexedDB is supported
    if (!window.indexedDB) {
      console.error("Your browser doesn't support IndexedDB");
      reject("IndexedDB not supported");
      return;
    }

    const request = window.indexedDB.open("SciVentureOfflineDB", 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject("Failed to open offline database");
    };

    request.onsuccess = () => {
      console.log("Offline database opened successfully");
      resolve();
    };

    // This will be called if the database doesn't exist or needs to be upgraded
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores (tables) for documents and videos
      if (!db.objectStoreNames.contains("documents")) {
        db.createObjectStore("documents", { keyPath: "id" });
        console.log("Created documents store");
      }
      
      if (!db.objectStoreNames.contains("videos")) {
        db.createObjectStore("videos", { keyPath: "id" });
        console.log("Created videos store");
      }
    };
  });
};

// Save content to IndexedDB for offline use
export const saveOfflineContent = async (content: OfflineContent): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const request = window.indexedDB.open("SciVentureOfflineDB", 1);

      request.onerror = () => {
        console.error("Failed to open offline database");
        // Fallback to localStorage only
        updateLocalStorageMetadata(content);
        resolve(true);
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Choose the correct object store based on content type
        const storeName = content.type === 'document' ? "documents" : "videos";
        
        try {
          // Start a transaction
          const transaction = db.transaction([storeName], "readwrite");
          const store = transaction.objectStore(storeName);
          
          // Add the content to the store
          const addRequest = store.put(content);
          
          addRequest.onsuccess = () => {
            // Also update the metadata in localStorage for quicker access
            updateLocalStorageMetadata(content);
            resolve(true);
          };
          
          addRequest.onerror = () => {
            console.error("Failed to save offline content");
            updateLocalStorageMetadata(content);
            resolve(true);
          };
          
          transaction.oncomplete = () => {
            db.close();
          };
        } catch (e) {
          console.error("Transaction error:", e);
          // Fallback to localStorage
          updateLocalStorageMetadata(content);
          resolve(true);
        }
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores (tables) for documents and videos
        if (!db.objectStoreNames.contains("documents")) {
          db.createObjectStore("documents", { keyPath: "id" });
          console.log("Created documents store");
        }
        
        if (!db.objectStoreNames.contains("videos")) {
          db.createObjectStore("videos", { keyPath: "id" });
          console.log("Created videos store");
        }
      };
    } catch (e) {
      console.error("Failed to access IndexedDB:", e);
      // Fallback to localStorage
      updateLocalStorageMetadata(content);
      resolve(true);
    }
  });
};

// Load all offline content metadata (not the actual content blobs)
export const loadOfflineContentMetadata = async (type: 'document' | 'video'): Promise<OfflineContent[]> => {
  // For faster access, get metadata from localStorage
  const storageKey = type === 'document' ? 'offlineDocuments' : 'offlineVideos';
  const storedData = localStorage.getItem(storageKey);
  
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (e) {
      console.error(`Error parsing ${type} metadata:`, e);
    }
  }
  
  // If nothing in localStorage, get from IndexedDB
  return new Promise((resolve, reject) => {
    try {
      const request = window.indexedDB.open("SciVentureOfflineDB", 1);
      
      request.onerror = () => {
        console.error("Failed to open offline database");
        resolve([]);
      };
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const storeName = type === 'document' ? "documents" : "videos";
        
        try {
          const transaction = db.transaction([storeName], "readonly");
          const store = transaction.objectStore(storeName);
          const getAllRequest = store.getAll();
          
          getAllRequest.onsuccess = () => {
            const items = getAllRequest.result.map(item => {
              // Don't include the binary data in metadata
              const { data, ...metadata } = item;
              return metadata;
            });
            
            // Cache the metadata in localStorage
            localStorage.setItem(storageKey, JSON.stringify(items));
            resolve(items);
          };
          
          getAllRequest.onerror = () => {
            console.error(`Failed to get ${type} list`);
            resolve([]);
          };
          
          transaction.oncomplete = () => {
            db.close();
          };
        } catch (e) {
          console.error("Transaction error:", e);
          resolve([]);
        }
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("documents")) {
          db.createObjectStore("documents", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("videos")) {
          db.createObjectStore("videos", { keyPath: "id" });
        }
      };
    } catch (e) {
      console.error("Failed to access IndexedDB:", e);
      resolve([]);
    }
  });
};

// Get a specific offline content including its data
export const getOfflineContent = async (id: number, type: 'document' | 'video'): Promise<OfflineContent | null> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("SciVentureOfflineDB", 1);
    
    request.onerror = () => {
      console.error("Failed to open offline database");
      resolve(null);
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const storeName = type === 'document' ? "documents" : "videos";
      
      try {
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const getRequest = store.get(id);
        
        getRequest.onsuccess = () => {
          if (getRequest.result) {
            resolve(getRequest.result);
          } else {
            resolve(null);
          }
        };
        
        getRequest.onerror = () => {
          console.error(`Failed to get ${type} with id ${id}`);
          resolve(null);
        };
        
        transaction.oncomplete = () => {
          db.close();
        };
      } catch (e) {
        console.error("Transaction error:", e);
        resolve(null);
      }
    };
  });
};

// Delete offline content
export const deleteOfflineContent = async (id: number, type: 'document' | 'video'): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open("SciVentureOfflineDB", 1);
      
      request.onerror = () => {
        console.error("Failed to open offline database");
        resolve(false);
      };
      
      request.onsuccess = (event) => {
        try {
          const db = (event.target as IDBOpenDBRequest).result;
          const storeName = type === 'document' ? "documents" : "videos";
          
          const transaction = db.transaction([storeName], "readwrite");
          const store = transaction.objectStore(storeName);
          const deleteRequest = store.delete(id);
          
          deleteRequest.onsuccess = () => {
            console.log(`Successfully deleted ${type} with id ${id} from IndexedDB`);
            // Also update localStorage
            removeFromLocalStorageMetadata(id, type);
            db.close();
            resolve(true);
          };
          
          deleteRequest.onerror = () => {
            console.error(`Failed to delete ${type} with id ${id}:`, deleteRequest.error);
            db.close();
            resolve(false);
          };
          
          transaction.onerror = () => {
            console.error("Transaction error:", transaction.error);
            db.close();
            resolve(false);
          };
        } catch (e) {
          console.error("Error in delete transaction:", e);
          resolve(false);
        }
      };
    } catch (e) {
      console.error("Failed to access IndexedDB:", e);
      resolve(false);
    }
  });
};

// Helper for updating localStorage metadata when saving content
function updateLocalStorageMetadata(content: OfflineContent) {
  const storageKey = content.type === 'document' ? 'offlineDocuments' : 'offlineVideos';
  const storedDataStr = localStorage.getItem(storageKey);
  
  let items: OfflineContent[] = [];
  if (storedDataStr) {
    try {
      items = JSON.parse(storedDataStr);
    } catch (e) {
      console.error(`Error parsing ${content.type} metadata:`, e);
    }
  }
  
  // Remove binary data before saving to localStorage
  const { data, ...metadataOnly } = content;
  
  // Update or add the item
  const existingIndex = items.findIndex(item => item.id === content.id);
  if (existingIndex >= 0) {
    items[existingIndex] = metadataOnly;
  } else {
    items.push(metadataOnly);
  }
  
  localStorage.setItem(storageKey, JSON.stringify(items));
}

// Helper for removing item from localStorage metadata
function removeFromLocalStorageMetadata(id: number, type: 'document' | 'video') {
  const storageKey = type === 'document' ? 'offlineDocuments' : 'offlineVideos';
  const storedDataStr = localStorage.getItem(storageKey);
  
  if (storedDataStr) {
    try {
      const items: OfflineContent[] = JSON.parse(storedDataStr);
      const updatedItems = items.filter(item => item.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    } catch (e) {
      console.error(`Error updating ${type} metadata:`, e);
    }
  }
}

// Check if the browser is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Calculate storage usage
export const getStorageUsage = async (): Promise<number> => {
  // This only works if the browser supports the Storage Manager API
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    } catch (e) {
      console.error('Error estimating storage:', e);
      return 0;
    }
  }
  
  // Fallback calculation from IndexedDB (not accurate but gives some estimate)
  let totalSize = 0;
  
  try {
    const documents = await loadOfflineContentMetadata('document');
    const videos = await loadOfflineContentMetadata('video');
    
    // Get file sizes from the metadata (approximate calculation)
    [...documents, ...videos].forEach(item => {
      const sizeStr = item.fileSize;
      const value = parseFloat(sizeStr.split(' ')[0]);
      const unit = sizeStr.split(' ')[1];
      
      if (unit === 'MB') totalSize += value * 1024 * 1024;
      else if (unit === 'KB') totalSize += value * 1024;
      else if (unit === 'GB') totalSize += value * 1024 * 1024 * 1024;
    });
  } catch (e) {
    console.error('Error calculating storage usage:', e);
  }
  
  return totalSize;
};