import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, Mail, Phone, Calendar, Activity } from "lucide-react";
import { useAdminCustomers } from "@/lib/admin-hooks";

const AdminCustomers = () => {
  const { data: customers = [], isLoading, error } = useAdminCustomers();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-luxury text-3xl font-bold text-primary">Customer Management</h1>
          <p className="text-muted-foreground">Manage customer accounts, profiles, and service history.</p>
        </div>
        <Button variant="luxury">
          <Plus className="w-4 h-4 mr-2" />
          Add New Customer
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customers..." className="pl-10" />
          </div>
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Export</Button>
        </div>
      </Card>

      {/* Customer List */}
      <Card className="shadow-luxury">
        <div className="p-6">
          <h2 className="font-luxury text-xl font-bold text-primary mb-4">Customer Directory</h2>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-accent mx-auto mb-4 animate-spin" />
                <p className="text-lg text-muted-foreground mb-2">Loading customers...</p>
                <p className="text-sm text-muted-foreground">Please wait while we fetch customer data</p>
              </div>
            ) : customers.length > 0 ? (
              customers.map((customer) => (
                <div key={customer.id} className="p-4 bg-card-luxury rounded-luxury hover:shadow-elegant transition-luxury">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-luxury rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary">{customer.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{customer.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Joined {customer.joinDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">{customer.bookings} Bookings</p>
                        <Badge variant={customer.status === 'Premium' ? 'default' : 'secondary'}>
                          {customer.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-accent mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-2">No customers found</p>
                <p className="text-sm text-muted-foreground mb-6">Customer accounts will appear here when users register</p>
                <Button variant="luxury">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Customer
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminCustomers;