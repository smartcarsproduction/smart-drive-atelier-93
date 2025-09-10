import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, Calendar, Car, Clock, MapPin, Phone, ArrowRight } from "lucide-react";

const BookingConfirmation = () => {
  // Mock booking data - in real app, this would come from booking state/context
  const bookingDetails = {
    confirmationNumber: "SC-2024-001234",
    service: "AI Diagnostics",
    date: "December 15, 2024",
    time: "10:00 AM - 12:00 PM",
    vehicle: "2023 Mercedes-Benz S-Class",
    location: "Smart Cars Beverly Hills",
    address: "9876 Rodeo Drive, Beverly Hills, CA 90210",
    price: "$299",
    concierge: "Victoria Sterling"
  };

  const nextSteps = [
    "You will receive a detailed service preparation guide via email within 15 minutes",
    "Our concierge team will contact you 24 hours before your appointment",
    "White-glove pickup service is included - no need to drive to our facility",
    "Real-time service updates will be sent to your mobile device"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-luxury text-4xl md:text-5xl font-bold text-primary mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Welcome to the Smart Cars Elite experience. Your luxury automotive service 
              has been scheduled with our master craftsmen.
            </p>
          </div>

          {/* Booking Details */}
          <Card className="p-8 shadow-luxury mb-8">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-accent-light">
              <h2 className="font-luxury text-2xl font-bold text-primary">Booking Details</h2>
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                Confirmed
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Confirmation Number</p>
                  <p className="font-mono text-lg font-semibold text-primary">{bookingDetails.confirmationNumber}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Service</p>
                  <p className="text-lg font-medium text-primary">{bookingDetails.service}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium text-primary">{bookingDetails.date}</p>
                    <p className="text-sm text-secondary">{bookingDetails.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicle</p>
                    <p className="font-medium text-primary">{bookingDetails.vehicle}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Service Location</p>
                    <p className="font-medium text-primary">{bookingDetails.location}</p>
                    <p className="text-sm text-muted-foreground">{bookingDetails.address}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Assigned Concierge</p>
                  <p className="font-medium text-primary">{bookingDetails.concierge}</p>
                </div>
                
                <div className="bg-card-luxury p-4 rounded-luxury">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Service Total</span>
                    <span className="text-2xl font-bold text-secondary">{bookingDetails.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Payment will be processed after service completion
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* What Happens Next */}
          <Card className="p-8 shadow-luxury mb-8 bg-card-luxury">
            <h2 className="font-luxury text-2xl font-bold text-primary mb-6">What Happens Next</h2>
            <div className="space-y-4">
              {nextSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-luxury rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-primary text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/dashboard">
              <Button variant="luxury" size="lg" className="w-full sm:w-auto">
                View in Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="elegant" size="lg" className="w-full sm:w-auto">
              Add to Calendar
            </Button>
            <Button variant="ghost" size="lg" className="w-full sm:w-auto">
              Print Details
            </Button>
          </div>

          {/* Emergency Contact */}
          <Card className="p-6 bg-gradient-hero text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Phone className="w-6 h-6 text-secondary" />
              <h3 className="font-luxury text-xl font-semibold text-primary-foreground">
                Need to Make Changes?
              </h3>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              Contact our concierge team for any modifications or questions about your booking
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="luxury">
                Call (555) 123-SMART
              </Button>
              <Link to="/contact">
                <Button variant="elegant">
                  Message Concierge
                </Button>
              </Link>
            </div>
          </Card>

          {/* Additional Services */}
          <div className="text-center mt-12">
            <h3 className="font-luxury text-xl font-semibold text-primary mb-4">
              Enhance Your Experience
            </h3>
            <p className="text-muted-foreground mb-6">
              Add premium services to your upcoming appointment
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button variant="elegant" className="h-auto p-4 flex-col space-y-2">
                <span className="font-medium">Interior Detailing</span>
                <span className="text-xs text-muted-foreground">+$299</span>
              </Button>
              <Button variant="elegant" className="h-auto p-4 flex-col space-y-2">
                <span className="font-medium">Paint Protection</span>
                <span className="text-xs text-muted-foreground">+$1,299</span>
              </Button>
              <Button variant="elegant" className="h-auto p-4 flex-col space-y-2">
                <span className="font-medium">Performance Tuning</span>
                <span className="text-xs text-muted-foreground">+$1,599</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingConfirmation;