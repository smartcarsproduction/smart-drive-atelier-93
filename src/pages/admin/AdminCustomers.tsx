import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, Mail, Phone, Calendar } from "lucide-react";

const AdminCustomers = () => {
  const customers = [
    { id: 1, name: "John Smith", email: "john.smith@email.com", phone: "+1 (555) 123-4567", joinDate: "Jan 2024", bookings: 5, status: "Active" },
    { id: 2, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+1 (555) 234-5678", joinDate: "Feb 2024", bookings: 3, status: "Active" },
    { id: 3, name: "Michael Chen", email: "m.chen@email.com", phone: "+1 (555) 345-6789", joinDate: "Mar 2024", bookings: 7, status: "Premium" },
    { id: 4, name: "Emma Davis", email: "emma.davis@email.com", phone: "+1 (555) 456-7890", joinDate: "Apr 2024", bookings: 2, status: "Active" },
  ];

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
            {customers.map((customer) => (
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
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminCustomers;