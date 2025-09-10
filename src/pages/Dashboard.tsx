import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, Car, Clock, Phone, Plus, Eye, Edit, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const upcomingBookings: Array<{
    id: number;
    service: string;
    date: string;
    time: string;
    vehicle: string;
    status: string;
  }> = [];

  const serviceHistory: Array<{
    id: number;
    service: string;
    date: string;
    vehicle: string;
    amount: string;
    status: string;
  }> = [];

  const vehicles: Array<{
    id: number;
    make: string;
    model: string;
    year: string;
    vin: string;
    lastService: string;
    nextService: string;
  }> = [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-luxury text-3xl md:text-4xl font-bold text-primary mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Manage your elite automotive services and vehicle profiles
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 shadow-elegant bg-card-luxury text-center">
              <div className="text-2xl font-bold text-secondary mb-1">{vehicles.length}</div>
              <div className="text-sm text-muted-foreground">Active Vehicles</div>
            </Card>
            <Card className="p-6 shadow-elegant bg-card-luxury text-center">
              <div className="text-2xl font-bold text-secondary mb-1">{upcomingBookings.length}</div>
              <div className="text-sm text-muted-foreground">Upcoming Services</div>
            </Card>
            <Card className="p-6 shadow-elegant bg-card-luxury text-center">
              <div className="text-2xl font-bold text-secondary mb-1">-</div>
              <div className="text-sm text-muted-foreground">Total Services</div>
            </Card>
            <Card className="p-6 shadow-elegant bg-card-luxury text-center">
              <Button variant="luxury" className="w-full" asChild>
                <Link to="/booking">
                  <Plus className="w-4 h-4 mr-2" />
                  Book Service
                </Link>
              </Button>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Bookings */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-luxury text-2xl font-bold text-primary">Upcoming Bookings</h2>
                <Link to="/booking">
                  <Button variant="elegant" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Booking
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <Card key={booking.id} className="p-6 shadow-elegant hover:shadow-luxury transition-luxury">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-primary">{booking.service}</h3>
                            <Badge 
                              variant={booking.status === "Confirmed" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {booking.date} at {booking.time}
                            </div>
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4" />
                              {booking.vehicle}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-8 text-center shadow-elegant">
                    <Calendar className="w-12 h-12 text-accent mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground mb-2">No upcoming bookings</p>
                    <p className="text-sm text-muted-foreground mb-4">Schedule a service to see your appointments here</p>
                    <Link to="/booking">
                      <Button variant="luxury">
                        <Plus className="w-4 h-4 mr-2" />
                        Book Service
                      </Button>
                    </Link>
                  </Card>
                )}
              </div>
            </div>

            {/* Service History */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-luxury text-2xl font-bold text-primary">Service History</h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {serviceHistory.length > 0 ? (
                  serviceHistory.map((service) => (
                    <Card key={service.id} className="p-6 shadow-elegant hover:shadow-luxury transition-luxury">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-primary">{service.service}</h3>
                            <Badge variant="outline" className="text-xs text-green-600">
                              {service.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {service.date}
                            </div>
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4" />
                              {service.vehicle}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-secondary">{service.amount}</div>
                          <Button variant="ghost" size="sm" className="mt-1">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-8 text-center shadow-elegant">
                    <Clock className="w-12 h-12 text-accent mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground mb-2">No service history</p>
                    <p className="text-sm text-muted-foreground">Your completed services will appear here</p>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Profiles */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-luxury text-2xl font-bold text-primary">Vehicle Profiles</h2>
              <Button variant="elegant" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="p-6 shadow-elegant hover:shadow-luxury transition-luxury group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-luxury text-lg font-semibold text-primary">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-sm text-muted-foreground">VIN: {vehicle.vin}</p>
                      </div>
                      <Car className="w-8 h-8 text-secondary" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Service:</span>
                        <span className="text-primary font-medium">{vehicle.lastService}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Next Service:</span>
                        <span className="text-secondary font-medium">{vehicle.nextService}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="elegant" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full p-8 text-center shadow-elegant">
                  <Car className="w-16 h-16 text-accent mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground mb-2">No vehicles registered</p>
                  <p className="text-sm text-muted-foreground mb-6">Add your vehicle to track service history and schedule maintenance</p>
                  <Button variant="luxury">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </Button>
                </Card>
              )}
            </div>
          </div>

          {/* Emergency Support */}
          <Card className="mt-12 p-6 bg-gradient-luxury border-secondary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-luxury text-lg font-semibold text-primary">Emergency Support</h3>
                  <p className="text-primary/80 text-sm">24/7 elite assistance for your luxury vehicles</p>
                </div>
              </div>
              <Button variant="hero">
                <Phone className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;