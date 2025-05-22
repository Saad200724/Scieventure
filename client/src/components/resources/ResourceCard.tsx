import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Resource } from '@shared/schema';
import { SUBJECT_TAGS } from '@/lib/constants';

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

  // Get subject-specific styling
  const subjectStyle = SUBJECT_TAGS[subject as keyof typeof SUBJECT_TAGS] || {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600'
  };

  // Handle download
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    // In a real implementation, this would trigger the actual download
    // For now, we'll just show an alert
    window.alert(`Downloading ${title}...`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="sm:flex h-full">
        {/* Image - Full width on mobile, 1/3 width on larger screens */}
        <div className="sm:w-1/3 flex-shrink-0">
          <img 
            src={thumbnail || '/placeholder-resource.jpg'} 
            alt={title} 
            className="h-48 sm:h-full w-full object-cover" 
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
          
          {/* Download info and button */}
          <div className="flex flex-wrap justify-between items-center gap-3 mt-auto">
            <div className="flex items-center text-xs text-gray-500">
              <Download className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{(downloadCount || 0).toLocaleString()} downloads</span>
            </div>
            <Button 
              className="flex items-center bg-primary text-white py-1.5 px-4 rounded-md text-sm hover:bg-primary-dark transition"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="whitespace-nowrap">Download PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
