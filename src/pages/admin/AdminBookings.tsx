import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Plus, Clock, Car, User } from "lucide-react";

const AdminBookings = () => {
  const bookings = [
    { id: "SC-001234", customer: "John Smith", service: "AI Diagnostics", date: "Dec 15, 2024", time: "10:00 AM", vehicle: "Tesla Model S", status: "Confirmed" },
    { id: "SC-001235", customer: "Sarah Johnson", service: "Engine Rebuild", date: "Dec 16, 2024", time: "2:00 PM", vehicle: "BMW M3", status: "In Progress" },
    { id: "SC-001236", customer: "Michael Chen", service: "Smart Customization", date: "Dec 17, 2024", time: "9:00 AM", vehicle: "Audi RS6", status: "Pending" },
    { id: "SC-001237", customer: "Emma Davis", service: "Predictive Maintenance", date: "Dec 18, 2024", time: "11:30 AM", vehicle: "Mercedes AMG", status: "Confirmed" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-primary">Booking Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage service appointments and scheduling.</p>
        </div>
        <Button variant="luxury" size="sm" className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search bookings..." className="pl-10" />
          </div>
          <div className="flex flex-row sm:flex-row gap-2 sm:gap-3">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">Today</Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">This Week</Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none hidden sm:inline-flex">Calendar View</Button>
          </div>
        </div>
      </Card>

      <Card className="shadow-luxury">
        <div className="p-4 sm:p-6">
          <h2 className="font-luxury text-lg sm:text-xl font-bold text-primary mb-4">Service Appointments</h2>
          <div className="space-y-3 sm:space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-4 bg-card-luxury rounded-luxury hover:shadow-elegant transition-luxury">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-luxury rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-primary mb-2 text-sm sm:text-base">{booking.service}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-x-6 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1 truncate">
                          <User className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{booking.customer}</span>
                        </div>
                        <div className="flex items-center space-x-1 truncate">
                          <Car className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{booking.vehicle}</span>
                        </div>
                        <div className="flex items-center space-x-1 truncate">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{booking.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 truncate">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{booking.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4 flex-shrink-0">
                    <Badge 
                      variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'In Progress' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {booking.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-xs sm:text-sm">Manage</Button>
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

export default AdminBookings;