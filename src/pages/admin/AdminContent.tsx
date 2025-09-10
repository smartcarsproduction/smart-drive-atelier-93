import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout, Plus, Edit, FileText, Image } from "lucide-react";

const AdminContent = () => {
  const pages = [
    { id: 1, title: "Home Page", status: "Published", lastModified: "2 hours ago", type: "Landing" },
    { id: 2, title: "About Us", status: "Published", lastModified: "1 day ago", type: "Info" },
    { id: 3, title: "Services", status: "Published", lastModified: "3 days ago", type: "Service" },
    { id: 4, title: "Contact", status: "Draft", lastModified: "1 week ago", type: "Contact" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-luxury text-3xl font-bold text-primary">Content Management</h1>
          <p className="text-muted-foreground">Manage website content, pages, and media.</p>
        </div>
        <Button variant="luxury">
          <Plus className="w-4 h-4 mr-2" />
          Create Page
        </Button>
      </div>

      <Card className="shadow-luxury">
        <div className="p-6">
          <h2 className="font-luxury text-xl font-bold text-primary mb-4">Pages</h2>
          <div className="space-y-4">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-4 bg-card-luxury rounded-luxury hover:shadow-elegant transition-luxury">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-luxury rounded-full flex items-center justify-center">
                    <Layout className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary">{page.title}</h3>
                    <p className="text-sm text-muted-foreground">Last modified: {page.lastModified}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={page.status === 'Published' ? 'default' : 'secondary'}>
                    {page.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminContent;