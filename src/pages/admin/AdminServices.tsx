import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Car, Search, Plus, Settings, Clock, Activity, AlertTriangle } from "lucide-react";
import { useAdminServices } from "@/lib/admin-hooks";

const AdminServices = () => {
  const { data: services = [], isLoading, error } = useAdminServices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-luxury text-3xl font-bold text-primary">Service Management</h1>
          <p className="text-muted-foreground">Manage available services, pricing, and configurations.</p>
        </div>
        <Button variant="luxury">
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search services..." className="pl-10" />
          </div>
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Categories</Button>
        </div>
      </Card>

      <Card className="shadow-luxury">
        <div className="p-6">
          <h2 className="font-luxury text-xl font-bold text-primary mb-4">Available Services</h2>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-accent mx-auto mb-4 animate-spin" />
                <p className="text-lg text-muted-foreground mb-2">Loading services...</p>
                <p className="text-sm text-muted-foreground">Please wait while we fetch service data</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-2">Failed to load services</p>
                <p className="text-sm text-muted-foreground">Please check your connection and try again</p>
              </div>
            ) : services.length > 0 ? (
              services.map((service) => (
                <div key={service.id} className="p-4 bg-card-luxury rounded-luxury hover:shadow-elegant transition-luxury">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-luxury rounded-full flex items-center justify-center">
                        <Car className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{service.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{service.price}</p>
                        <Badge variant={service.status === 'Active' ? 'default' : 'secondary'}>
                          {service.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-accent mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-2">No services configured</p>
                <p className="text-sm text-muted-foreground mb-6">Add your first service to get started</p>
                <Button variant="luxury">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Service
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminServices;