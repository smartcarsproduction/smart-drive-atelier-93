import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Search, Image, Video, File, Trash2 } from "lucide-react";

const AdminMedia = () => {
  const mediaFiles = [
    { id: 1, name: "hero-luxury-car.jpg", type: "image", size: "2.4 MB", uploaded: "Dec 10, 2024", url: "/assets/hero-luxury-car.jpg" },
    { id: 2, name: "service-demo.mp4", type: "video", size: "15.2 MB", uploaded: "Dec 8, 2024", url: "/videos/service-demo.mp4" },
    { id: 3, name: "company-brochure.pdf", type: "document", size: "1.8 MB", uploaded: "Dec 5, 2024", url: "/docs/brochure.pdf" },
    { id: 4, name: "customer-testimonial.jpg", type: "image", size: "1.2 MB", uploaded: "Dec 3, 2024", url: "/assets/testimonial.jpg" },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      default: return File;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-luxury text-3xl font-bold text-primary">Media Library</h1>
          <p className="text-muted-foreground">Manage images, videos, and documents for your website.</p>
        </div>
        <Button variant="luxury">
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search media files..." className="pl-10" />
          </div>
          <Button variant="outline">Filter by Type</Button>
          <Button variant="outline">Sort by Date</Button>
        </div>
      </Card>

      <Card className="shadow-luxury">
        <div className="p-6">
          <h2 className="font-luxury text-xl font-bold text-primary mb-4">Media Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaFiles.map((file) => {
              const IconComponent = getFileIcon(file.type);
              return (
                <div key={file.id} className="p-4 bg-card-luxury rounded-luxury hover:shadow-elegant transition-luxury border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-luxury rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary text-sm truncate mb-1">{file.name}</h3>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                    <p className="text-xs text-muted-foreground">Uploaded {file.uploaded}</p>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <Button variant="outline" size="sm" className="text-xs">View</Button>
                    <Button variant="outline" size="sm" className="text-xs">Copy URL</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminMedia;