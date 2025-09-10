import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Layout, Plus, Edit, FileText, Image, Save, RotateCcw } from "lucide-react";
import { useWebsiteContent } from "@/lib/contentStore";
import { useState } from "react";
import { toast } from "sonner";

const AdminContent = () => {
  const { content, updateSection, resetToDefault } = useWebsiteContent();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const contentSections = [
    { 
      id: "homepage", 
      title: "Home Page", 
      description: "Hero section, main content and call-to-action buttons",
      fields: ["heroTitle", "heroSubtitle", "heroButton", "servicesTitle", "aboutTitle", "aboutDescription"]
    },
    { 
      id: "services", 
      title: "Services Page", 
      description: "Service listings, descriptions and pricing",
      fields: ["title", "subtitle", "services"]
    },
    { 
      id: "about", 
      title: "About Page", 
      description: "Company information and features",
      fields: ["title", "subtitle", "description", "features"]
    },
    { 
      id: "contact", 
      title: "Contact Page", 
      description: "Contact information and forms",
      fields: ["title", "subtitle", "phone", "email", "address", "hours"]
    },
    { 
      id: "footer", 
      title: "Footer", 
      description: "Site-wide footer content",
      fields: ["companyName", "description", "phone", "email", "address"]
    }
  ];

  const handleEdit = (sectionId: string) => {
    setEditingSection(sectionId);
    setEditForm({ ...content[sectionId as keyof typeof content] });
  };

  const handleSave = () => {
    if (editingSection) {
      updateSection(editingSection as keyof typeof content, editForm);
      toast.success("Content updated successfully!");
      setEditingSection(null);
      setEditForm({});
    }
  };

  const handleReset = () => {
    resetToDefault();
    toast.success("Content reset to default!");
  };

  const renderEditForm = () => {
    if (!editingSection) return null;

    const section = contentSections.find(s => s.id === editingSection);
    if (!section) return null;

    return (
      <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {section.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {section.fields.map((field) => {
              if (field === "services" && editingSection === "services") {
                return (
                  <div key={field} className="space-y-2">
                    <Label>Services</Label>
                    <div className="space-y-4">
                      {editForm.services?.map((service: any, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Service Name</Label>
                              <Input
                                value={service.name}
                                onChange={(e) => {
                                  const newServices = [...editForm.services];
                                  newServices[index].name = e.target.value;
                                  setEditForm({ ...editForm, services: newServices });
                                }}
                              />
                            </div>
                            <div>
                              <Label>Price</Label>
                              <Input
                                value={service.price}
                                onChange={(e) => {
                                  const newServices = [...editForm.services];
                                  newServices[index].price = e.target.value;
                                  setEditForm({ ...editForm, services: newServices });
                                }}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Description</Label>
                              <Textarea
                                value={service.description}
                                onChange={(e) => {
                                  const newServices = [...editForm.services];
                                  newServices[index].description = e.target.value;
                                  setEditForm({ ...editForm, services: newServices });
                                }}
                              />
                            </div>
                            <div>
                              <Label>Duration</Label>
                              <Input
                                value={service.duration}
                                onChange={(e) => {
                                  const newServices = [...editForm.services];
                                  newServices[index].duration = e.target.value;
                                  setEditForm({ ...editForm, services: newServices });
                                }}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              }

              if (field === "features" && editingSection === "about") {
                return (
                  <div key={field} className="space-y-2">
                    <Label>Features</Label>
                    <div className="space-y-4">
                      {editForm.features?.map((feature: any, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-2">
                            <div>
                              <Label>Title</Label>
                              <Input
                                value={feature.title}
                                onChange={(e) => {
                                  const newFeatures = [...editForm.features];
                                  newFeatures[index].title = e.target.value;
                                  setEditForm({ ...editForm, features: newFeatures });
                                }}
                              />
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea
                                value={feature.description}
                                onChange={(e) => {
                                  const newFeatures = [...editForm.features];
                                  newFeatures[index].description = e.target.value;
                                  setEditForm({ ...editForm, features: newFeatures });
                                }}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              }

              const value = editForm[field] || "";
              const isTextarea = field.includes("description") || field.includes("subtitle");

              return (
                <div key={field} className="space-y-2">
                  <Label className="capitalize">{field.replace(/([A-Z])/g, " $1").trim()}</Label>
                  {isTextarea ? (
                    <Textarea
                      value={value}
                      onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                      rows={3}
                    />
                  ) : (
                    <Input
                      value={value}
                      onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setEditingSection(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-luxury text-3xl font-bold text-primary">Website Content Management</h1>
          <p className="text-muted-foreground">Edit website content that users see in real-time.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      </div>

      <Card className="shadow-luxury">
        <div className="p-6">
          <h2 className="font-luxury text-xl font-bold text-primary mb-4">Content Sections</h2>
          <div className="space-y-4">
            {contentSections.map((section) => (
              <div key={section.id} className="flex items-center justify-between p-4 bg-card-luxury rounded-luxury hover:shadow-elegant transition-luxury">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-luxury rounded-full flex items-center justify-center">
                    <Layout className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="default">Live</Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(section.id)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Content
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {renderEditForm()}

      {/* Content Preview */}
      <Card className="shadow-luxury">
        <div className="p-6">
          <h2 className="font-luxury text-xl font-bold text-primary mb-4">Live Content Preview</h2>
          <div className="bg-muted/30 rounded-lg p-4 space-y-4">
            <div>
              <h3 className="font-semibold text-primary">Homepage Hero</h3>
              <p className="text-sm text-muted-foreground">Title: {content.homepage.heroTitle}</p>
              <p className="text-sm text-muted-foreground">Subtitle: {content.homepage.heroSubtitle.slice(0, 100)}...</p>
            </div>
            <div>
              <h3 className="font-semibold text-primary">Services</h3>
              <p className="text-sm text-muted-foreground">Available Services: {content.services.services.length}</p>
            </div>
            <div>
              <h3 className="font-semibold text-primary">Contact Info</h3>
              <p className="text-sm text-muted-foreground">Phone: {content.contact.phone}</p>
              <p className="text-sm text-muted-foreground">Email: {content.contact.email}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminContent;