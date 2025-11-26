import React, { useState } from 'react';
import { Download, Wifi, WifiOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Resource } from '@shared/schema';
import { SUBJECT_TAGS } from '@/lib/constants';
import { saveOfflineContent, OfflineContent } from '@/lib/offlineStorage';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const {
    id,
    title,
    description,
    fileSize,
    subject,
    tags,
    downloadCount = 0,
    filePath,
    thumbnail = ''
  } = resource;

  const [isDownloading, setIsDownloading] = useState(false);
  const [isSavedOffline, setIsSavedOffline] = useState(false);

  // Check if this resource is already saved offline when component mounts
  React.useEffect(() => {
    const checkOfflineStatus = async () => {
      const offlineResources = localStorage.getItem('offlineDocuments');
      if (offlineResources) {
        try {
          const resources = JSON.parse(offlineResources);
          setIsSavedOffline(resources.some((item: OfflineContent) => item.id === id));
        } catch (e) {
          console.error('Error checking offline status:', e);
        }
      }
    };

    checkOfflineStatus();
  }, [id]);

  // Get subject-specific styling
  const subjectStyle = SUBJECT_TAGS[subject as keyof typeof SUBJECT_TAGS] || {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600'
  };

  // Handle regular download
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      // Make API request to generate/download the PDF
      const response = await fetch(filePath || `/attached_assets/Lab_Manual.pdf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download resource');
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download error:', error);
      // Fallback: show alert if download fails
      window.alert(`Error downloading ${title}. Please try again later.`);
    }
  };

  // Handle saving content for offline use
  const handleSaveOffline = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isSavedOffline) {
      // Already saved - notify user
      alert(`${title} is already saved for offline use`);
      return;
    }

    setIsDownloading(true);

    try {
      // Make API request to get the content
      const response = await fetch(filePath || `/attached_assets/Lab_Manual.pdf`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to download resource');
      }

      // Get the content as a blob
      const blob = await response.blob();

      // Create the offline content object
      const offlineContent: OfflineContent = {
        id,
        title,
        description,
        subject,
        fileSize,
        thumbnail: thumbnail || '/placeholder-resource.jpg',
        downloadDate: new Date().toISOString(),
        url: URL.createObjectURL(blob), // Temporary URL for this session
        type: 'document',
        data: blob // The actual file content
      };

      // Save to IndexedDB
      const success = await saveOfflineContent(offlineContent);

      if (success) {
        setIsSavedOffline(true);
        // Show success notification
        alert(`${title} is now available offline`);
      } else {
        throw new Error('Failed to save content offline');
      }

    } catch (error) {
      console.error('Offline save error:', error);
      // Show error notification
      alert(`Could not save ${title} for offline use. Please try again.`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="sm:flex h-full">
        {/* Image - Full width on mobile, 1/3 width on larger screens */}
        <div className="sm:w-1/3 flex-shrink-0 bg-gray-100 flex items-center justify-center min-h-40 sm:min-h-0">
          <img 
            src={thumbnail || '/placeholder-resource.jpg'} 
            alt={title} 
            className="w-full h-full object-contain" 
          />
        </div>

        {/* Content - Full width on mobile, 2/3 width on larger screens */}
        <div className="p-4 sm:p-5 sm:w-2/3 flex flex-col flex-grow">
          {/* Tags and file size */}
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <span className={`text-xs ${subjectStyle.bgColor} ${subjectStyle.textColor} px-2 py-1 rounded-full`}>
              {subject}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap">
              {fileSize}
            </span>
          </div>

          {/* Title and description */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {Array.isArray(tags) && tags.map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Download info and buttons */}
          <div className="flex flex-wrap justify-between items-center gap-3 mt-auto">
            <div className="flex items-center text-xs text-gray-500">
              <Download className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{(downloadCount || 0).toLocaleString()} downloads</span>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex items-center bg-primary text-white py-1.5 px-4 rounded-md text-sm hover:bg-primary-dark transition"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="whitespace-nowrap">Download</span>
              </Button>

              {/* Save for offline button */}
              <Button 
                className={`flex items-center py-1.5 px-4 rounded-md text-sm transition ${
                  isSavedOffline 
                    ? "bg-secondary/20 text-secondary border border-secondary" 
                    : "bg-secondary text-white hover:bg-secondary/90"
                }`}
                onClick={handleSaveOffline}
                disabled={isDownloading || isSavedOffline}
              >
                {isDownloading ? (
                  <span className="whitespace-nowrap">Saving...</span>
                ) : isSavedOffline ? (
                  <>
                    <Check className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="whitespace-nowrap">Saved Offline</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="whitespace-nowrap">Save Offline</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;