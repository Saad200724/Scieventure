import { Resource } from "@shared/schema";

export interface OfflineResource {
  id: number;
  title: string;
  description: string;
  subject: string;
  fileSize: string;
  thumbnail: string;
  downloadDate: string;
  filePath: string;
  type: 'document';
}

// Download and save resource to offline storage
export async function downloadResourceOffline(resource: Resource): Promise<boolean> {
  try {
    // Get existing offline resources
    const existingResourcesJson = localStorage.getItem('offlineResources');
    const existingResources: OfflineResource[] = existingResourcesJson 
      ? JSON.parse(existingResourcesJson) 
      : [];

    // Check if already downloaded
    if (existingResources.some(r => r.id === resource.id)) {
      return true; // Already downloaded
    }

    // Create offline resource object
    const offlineResource: OfflineResource = {
      id: resource.id,
      title: resource.title,
      description: resource.description,
      subject: resource.subject,
      fileSize: resource.fileSize || '0 KB',
      thumbnail: resource.thumbnail || '📄',
      downloadDate: new Date().toLocaleString(),
      filePath: resource.filePath,
      type: 'document'
    };

    // Save to localStorage
    existingResources.push(offlineResource);
    localStorage.setItem('offlineResources', JSON.stringify(existingResources));

    return true;
  } catch (error) {
    console.error('Error downloading resource offline:', error);
    return false;
  }
}

// Check if resource is already downloaded
export function isResourceDownloaded(resourceId: number): boolean {
  try {
    const existingResourcesJson = localStorage.getItem('offlineResources');
    const existingResources: OfflineResource[] = existingResourcesJson 
      ? JSON.parse(existingResourcesJson) 
      : [];
    
    return existingResources.some(r => r.id === resourceId);
  } catch (error) {
    console.error('Error checking if resource is downloaded:', error);
    return false;
  }
}

// Get all offline resources
export function getOfflineResources(): OfflineResource[] {
  try {
    const existingResourcesJson = localStorage.getItem('offlineResources');
    return existingResourcesJson ? JSON.parse(existingResourcesJson) : [];
  } catch (error) {
    console.error('Error getting offline resources:', error);
    return [];
  }
}

// Delete offline resource
export function deleteOfflineResource(resourceId: number): boolean {
  try {
    const existingResourcesJson = localStorage.getItem('offlineResources');
    let resources: OfflineResource[] = existingResourcesJson 
      ? JSON.parse(existingResourcesJson) 
      : [];
    
    resources = resources.filter(r => r.id !== resourceId);
    localStorage.setItem('offlineResources', JSON.stringify(resources));
    
    return true;
  } catch (error) {
    console.error('Error deleting offline resource:', error);
    return false;
  }
}

// Calculate total offline storage size
export function getTotalOfflineStorageSize(): string {
  try {
    const resources = getOfflineResources();
    let totalSize = 0;

    resources.forEach(resource => {
      const size = parseFloat(resource.fileSize.split(' ')[0]);
      const unit = resource.fileSize.split(' ')[1];

      if (unit === 'MB') totalSize += size * 1024 * 1024;
      else if (unit === 'KB') totalSize += size * 1024;
    });

    return (totalSize / (1024 * 1024)).toFixed(2);
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return '0';
  }
}

// Open/view offline resource
export function viewOfflineResource(filePath: string): void {
  try {
    // In a real implementation, this would fetch from IndexedDB
    // For now, we'll create a preview or download link
    const link = document.createElement('a');
    link.href = filePath;
    link.download = true;
    link.click();
  } catch (error) {
    console.error('Error viewing offline resource:', error);
  }
}
