import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/LanguageProvider';
import { Trash2, Play, FileText, Eye, Download } from 'lucide-react';
import { Link } from 'wouter';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Type definitions for offline content
interface OfflineResource {
  id: number;
  title: string;
  description: string;
  subject: string;
  fileSize: string;
  thumbnail: string;
  downloadDate: string;
  url: string;
  type: 'document' | 'video';
}

const OfflineContent: React.FC = () => {
  const { t } = useLanguage();
  const [offlineResources, setOfflineResources] = useState<OfflineResource[]>([]);
  const [offlineVideos, setOfflineVideos] = useState<OfflineResource[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<OfflineResource | null>(null);
  const [activeTab, setActiveTab] = useState("documents");
  
  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);
  
  // Load offline content from localStorage/IndexedDB on component mount
  useEffect(() => {
    // Load saved resources from localStorage
    const savedResources = localStorage.getItem('offlineResources');
    if (savedResources) {
      try {
        setOfflineResources(JSON.parse(savedResources));
      } catch (e) {
        console.error('Error parsing offline resources:', e);
      }
    }
    
    const savedVideos = localStorage.getItem('offlineVideos');
    if (savedVideos) {
      try {
        setOfflineVideos(JSON.parse(savedVideos));
      } catch (e) {
        console.error('Error parsing offline videos:', e);
      }
    }
  }, []);
  
  // Delete an offline item
  const handleDelete = (item: OfflineResource) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };
  
  // Confirm deletion of an offline item
  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'document') {
      const updatedResources = offlineResources.filter(r => r.id !== itemToDelete.id);
      setOfflineResources(updatedResources);
      localStorage.setItem('offlineResources', JSON.stringify(updatedResources));
      
      // Also remove the actual file from IndexedDB if applicable
      // This would require integration with IndexedDB API
      
    } else if (itemToDelete.type === 'video') {
      const updatedVideos = offlineVideos.filter(v => v.id !== itemToDelete.id);
      setOfflineVideos(updatedVideos);
      localStorage.setItem('offlineVideos', JSON.stringify(updatedVideos));
      
      // Also remove the actual video file from IndexedDB if applicable
    }
    
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };
  
  // View an offline document
  const viewDocument = (resource: OfflineResource) => {
    // For demo purposes, we'll just open the URL
    // In a full implementation, this would load from IndexedDB
    window.open(resource.url, '_blank');
  };
  
  // Play an offline video
  const playVideo = (video: OfflineResource) => {
    // For demo purposes, we'll just open the URL
    // In a full implementation, this would load the video from IndexedDB
    window.open(video.url, '_blank');
  };
  
  // Calculate total storage used
  const totalStorageUsed = () => {
    // This is a placeholder calculation
    // In a real implementation, you would calculate actual file sizes from IndexedDB
    let totalSize = 0;
    
    offlineResources.forEach(resource => {
      // Convert sizes like "4.2 MB" to bytes (approximate)
      const size = parseFloat(resource.fileSize.split(' ')[0]);
      const unit = resource.fileSize.split(' ')[1];
      
      if (unit === 'MB') totalSize += size * 1024 * 1024;
      else if (unit === 'KB') totalSize += size * 1024;
    });
    
    offlineVideos.forEach(video => {
      const size = parseFloat(video.fileSize.split(' ')[0]);
      const unit = video.fileSize.split(' ')[1];
      
      if (unit === 'MB') totalSize += size * 1024 * 1024;
      else if (unit === 'KB') totalSize += size * 1024;
    });
    
    // Convert to MB for display
    return (totalSize / (1024 * 1024)).toFixed(2);
  };

  return (
    <>
      <Helmet>
        <title>{t("Offline Content | SciVenture", "অফলাইন কন্টেন্ট | সাইভেঞ্চার")}</title>
        <meta name="description" content={t("Access your downloaded content for offline use.", "অফলাইন ব্যবহারের জন্য আপনার ডাউনলোড করা কন্টেন্ট অ্যাক্সেস করুন।")} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{t("My Offline Content", "আমার অফলাইন কন্টেন্ট")}</h1>
          <p className="text-gray-600 mb-2">
            {t(
              "Access your downloaded content even when you're offline. These materials are stored on your device.",
              "আপনি অফলাইন থাকলেও আপনার ডাউনলোড করা কন্টেন্ট অ্যাক্সেস করুন। এই উপকরণগুলি আপনার ডিভাইসে সংরক্ষিত আছে।"
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("Storage used:", "স্টোরেজ ব্যবহৃত:")} <span className="font-medium">{totalStorageUsed()} MB</span>
          </p>
        </div>

        <div className="mb-6 flex justify-end">
          <Link href="/resources">
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t("Download More Content", "আরো কন্টেন্ট ডাউনলোড করুন")}
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="documents" value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="documents">
              <FileText className="h-4 w-4 mr-2" />
              {t("Documents", "ডকুমেন্টস")} ({offlineResources.length})
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Play className="h-4 w-4 mr-2" />
              {t("Videos", "ভিডিও")} ({offlineVideos.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents">
            {offlineResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offlineResources.map(resource => (
                  <Card key={resource.id} className="overflow-hidden">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={resource.thumbnail} 
                        alt={resource.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-1">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{resource.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <span className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded-full">
                            {resource.subject}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {resource.fileSize}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(resource)}
                            title={t("Delete", "মুছুন")}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => viewDocument(resource)}
                            title={t("View", "দেখুন")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  {t("No offline documents", "কোন অফলাইন ডকুমেন্ট নেই")}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t(
                    "You haven't downloaded any documents for offline use yet.",
                    "আপনি এখনও অফলাইন ব্যবহারের জন্য কোন ডকুমেন্ট ডাউনলোড করেননি।"
                  )}
                </p>
                <Link href="/resources">
                  <Button>
                    {t("Browse Resources", "রিসোর্স ব্রাউজ করুন")}
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="videos">
            {offlineVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offlineVideos.map(video => (
                  <Card key={video.id} className="overflow-hidden">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-1">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{video.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <span className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded-full">
                            {video.subject}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {video.fileSize}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(video)}
                            title={t("Delete", "মুছুন")}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => playVideo(video)}
                            title={t("Play", "প্লে করুন")}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  {t("No offline videos", "কোন অফলাইন ভিডিও নেই")}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t(
                    "You haven't downloaded any videos for offline use yet.",
                    "আপনি এখনও অফলাইন ব্যবহারের জন্য কোন ভিডিও ডাউনলোড করেননি।"
                  )}
                </p>
                <Link href="/resources">
                  <Button>
                    {t("Browse Resources", "রিসোর্স ব্রাউজ করুন")}
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("Delete Offline Content", "অফলাইন কন্টেন্ট মুছুন")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "Are you sure you want to delete this content? This will remove it from your offline storage.",
                "আপনি কি নিশ্চিত যে আপনি এই কন্টেন্ট মুছতে চান? এটি আপনার অফলাইন স্টোরেজ থেকে সরিয়ে দেবে।"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("Cancel", "বাতিল করুন")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("Delete", "মুছুন")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OfflineContent;