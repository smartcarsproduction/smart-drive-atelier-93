import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, Clock, Car, CreditCard, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Booking = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [vehicleImages, setVehicleImages] = useState<FileList | null>(null);

  const services: Array<{
    id: string;
    name: string;
    price: number;
    duration: string;
  }> = [];

  const timeSlots: string[] = [];

  const [bookingData, setBookingData] = useState({
    service: "",
    date: "",
    time: "",
    vehicleInfo: {
      make: "",
      model: "",
      year: "",
      vin: "",
      mileage: "",
      issues: ""
    },
    paymentMethod: ""
  });

  const selectedServiceData = services.find(s => s.id === selectedService);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleConfirmBooking();
    }
  };

  const handleConfirmBooking = () => {
    toast.success("Booking confirmed! Redirecting to confirmation page...");
    setTimeout(() => {
      navigate("/booking-confirmation");
    }, 1500);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-luxury text-2xl font-bold text-primary mb-2">Select Service</h2>
              <p className="text-muted-foreground">Choose the service you need for your vehicle</p>
            </div>
            
            <div className="grid gap-4">
              {services.length > 0 ? (
                services.map((service) => (
                  <Card 
                    key={service.id}
                    className={cn(
                      "p-4 cursor-pointer transition-luxury hover:shadow-elegant",
                      selectedService === service.id ? "ring-2 ring-secondary bg-card-luxury" : "bg-card"
                    )}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-luxury text-lg font-semibold text-primary">{service.name}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {service.duration}
                          </Badge>
                          <span className="text-lg font-bold text-secondary">₹{service.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        selectedService === service.id ? "border-secondary bg-secondary" : "border-accent"
                      )}>
                        {selectedService === service.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <Car className="w-12 h-12 text-accent mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground mb-2">No services available</p>
                  <p className="text-sm text-muted-foreground">Services will be loaded shortly. Please check back in a moment.</p>
                </Card>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-luxury text-2xl font-bold text-primary mb-2">Select Date & Time</h2>
              <p className="text-muted-foreground">Choose your preferred appointment slot</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <Label className="text-primary font-medium mb-3 block">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-luxury border border-accent-light bg-card p-3"
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                />
              </div>
              
              {/* Time Slots */}
              <div>
                <Label className="text-primary font-medium mb-3 block">Select Time</Label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.length > 0 ? (
                    timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "luxury" : "elegant"}
                        className="justify-center"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <Clock className="w-8 h-8 text-accent mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2">No time slots available</p>
                      <p className="text-xs text-muted-foreground">Please select a date to see available times</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {selectedDate && selectedTime && (
              <Card className="p-4 bg-card-luxury">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-secondary" />
                  <span className="font-medium text-primary">
                    {format(selectedDate, "MMMM d, yyyy")} at {selectedTime}
                  </span>
                </div>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-luxury text-2xl font-bold text-primary mb-2">Vehicle Information</h2>
              <p className="text-muted-foreground">Help us prepare for your service</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make" className="text-primary font-medium">Make</Label>
                <Select onValueChange={(value) => setBookingData({
                  ...bookingData,
                  vehicleInfo: { ...bookingData.vehicleInfo, make: value }
                })}>
                  <SelectTrigger className="bg-background border-accent-light focus:border-secondary">
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="audi">Audi</SelectItem>
                    <SelectItem value="porsche">Porsche</SelectItem>
                    <SelectItem value="bentley">Bentley</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model" className="text-primary font-medium">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g., S-Class"
                  className="bg-background border-accent-light focus:border-secondary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year" className="text-primary font-medium">Year</Label>
                <Input
                  id="year"
                  placeholder="2024"
                  className="bg-background border-accent-light focus:border-secondary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mileage" className="text-primary font-medium">Mileage</Label>
                <Input
                  id="mileage"
                  placeholder="50,000"
                  className="bg-background border-accent-light focus:border-secondary"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vin" className="text-primary font-medium">VIN (Optional)</Label>
              <Input
                id="vin"
                placeholder="17-character VIN"
                className="bg-background border-accent-light focus:border-secondary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issues" className="text-primary font-medium">Describe Any Issues</Label>
              <Textarea
                id="issues"
                placeholder="Please describe any problems, symptoms, or specific concerns..."
                rows={4}
                className="bg-background border-accent-light focus:border-secondary"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-primary font-medium">Upload Vehicle Images (Optional)</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setVehicleImages(e.target.files)}
                className="bg-background border-accent-light focus:border-secondary"
              />
              <p className="text-xs text-muted-foreground">
                Upload photos of any visible damage or areas of concern
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-luxury text-2xl font-bold text-primary mb-2">Confirm & Pay</h2>
              <p className="text-muted-foreground">Review your booking details and complete payment</p>
            </div>
            
            {/* Booking Summary */}
            <Card className="p-6 bg-card-luxury">
              <h3 className="font-luxury text-lg font-semibold text-primary mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium text-primary">{selectedServiceData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-medium text-primary">
                    {selectedDate && format(selectedDate, "MMM d, yyyy")} at {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-primary">{selectedServiceData?.duration}</span>
                </div>
                <div className="border-t border-accent-light pt-3 flex justify-between">
                  <span className="font-semibold text-primary">Total:</span>
                  <span className="font-bold text-lg text-secondary">
                    ₹{selectedServiceData?.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
            
            {/* Payment Method */}
            <Card className="p-6">
              <h3 className="font-luxury text-lg font-semibold text-primary mb-4">Payment Method</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {["Credit Card", "PayPal", "Bank Transfer"].map((method) => (
                    <Button
                      key={method}
                      variant={bookingData.paymentMethod === method ? "luxury" : "elegant"}
                      className="text-xs"
                      onClick={() => setBookingData({ ...bookingData, paymentMethod: method })}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      {method}
                    </Button>
                  ))}
                </div>
                
                {bookingData.paymentMethod === "Credit Card" && (
                  <div className="space-y-3">
                    <Input placeholder="Card Number" className="bg-background border-accent-light" />
                    <div className="grid grid-cols-3 gap-3">
                      <Input placeholder="MM/YY" className="bg-background border-accent-light" />
                      <Input placeholder="CVC" className="bg-background border-accent-light" />
                      <Input placeholder="ZIP" className="bg-background border-accent-light" />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-luxury text-3xl font-bold text-primary">Book Your Service</h1>
              <span className="text-sm text-muted-foreground">Step {currentStep} of 4</span>
            </div>
            <Progress value={(currentStep / 4) * 100} className="h-2" />
          </div>
          
          {/* Step Content */}
          <Card className="p-8 shadow-luxury">
            {renderStep()}
            
            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
              {currentStep > 1 && (
                <Button
                  variant="elegant"
                  className="flex-1"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Back
                </Button>
              )}
              <Button
                variant="luxury"
                className="flex-1"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedService) ||
                  (currentStep === 2 && (!selectedDate || !selectedTime)) ||
                  (currentStep === 4 && !bookingData.paymentMethod)
                }
              >
                {currentStep === 4 ? "Confirm Booking" : "Continue"}
              </Button>
            </div>
          </Card>
          
          {/* Need Help */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Need assistance with your booking?{" "}
              <Link to="/contact" className="text-secondary hover:underline font-medium">
                Contact our concierge team
              </Link>
              {" "}or call{" "}
              <span className="text-secondary font-medium">+91 98765 43210</span>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Booking;