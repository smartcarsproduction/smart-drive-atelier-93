import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Clock, Car, CreditCard, Check, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useServices, formatPrice, formatDuration } from "@/lib/service-hooks";
import { useAvailableTimeSlots, useBookTimeSlot, formatTimeSlot, sortSlotsByTime } from "@/lib/timeslot-hooks";
import { useAuth } from "@/contexts/AuthContext";
import type { Service, TimeSlot } from "@/lib/schema";
import { bookingApi } from "@/lib/api-client";

const Booking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedService, setSelectedService] = useState("");
  const [vehicleImages, setVehicleImages] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch services data
  const { data: services = [], isLoading: servicesLoading, error: servicesError } = useServices();
  
  // Fetch available time slots for selected date
  const { data: availableTimeSlots = [], isLoading: timeSlotsLoading, refetch: refetchTimeSlots } = 
    useAvailableTimeSlots(selectedDate);
  
  // Book time slot mutation
  const bookTimeSlotMutation = useBookTimeSlot();
  
  // Sort time slots by time
  const sortedTimeSlots = sortSlotsByTime(availableTimeSlots);

  const [bookingData, setBookingData] = useState({
    service: "",
    date: "",
    timeSlotId: "",
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
  
  // Update booking data when selections change
  useEffect(() => {
    if (selectedDate) {
      setBookingData(prev => ({ ...prev, date: selectedDate.toISOString() }));
    }
  }, [selectedDate]);
  
  useEffect(() => {
    if (selectedTimeSlot) {
      setBookingData(prev => ({ ...prev, timeSlotId: selectedTimeSlot.id }));
    }
  }, [selectedTimeSlot]);
  
  useEffect(() => {
    if (selectedService) {
      setBookingData(prev => ({ ...prev, service: selectedService }));
    }
  }, [selectedService]);
  
  // Clear selected time slot when date changes
  useEffect(() => {
    setSelectedTimeSlot(null);
  }, [selectedDate]);

  const selectedServiceData = services.find((s: Service) => s.id === selectedService);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleConfirmBooking();
    }
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      toast.error("Please log in to complete your booking");
      navigate("/login");
      return;
    }
    
    if (!selectedServiceData || !selectedTimeSlot || !selectedDate) {
      toast.error("Missing booking information");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the booking with a simplified approach for now
      // In a real app, we'd need proper vehicle selection/creation
      const scheduledDate = new Date(selectedDate);
      const [hours, minutes] = selectedTimeSlot.startTime.split(':').map(Number);
      scheduledDate.setHours(hours, minutes, 0, 0);
      
      const bookingPayload = {
        userId: user.id,
        serviceId: selectedService,
        scheduledDate: scheduledDate.toISOString(),
        notes: bookingData.vehicleInfo.issues || 'Service booking',
        totalPrice: selectedServiceData.price,
        vehicleInfo: bookingData.vehicleInfo,
        // This is simplified - in production we'd have proper vehicle management
        vehicleId: 'temp-vehicle-id'
      };
      
      const booking = await bookingApi.createBooking(bookingPayload);
      
      // Then book the time slot
      await bookTimeSlotMutation.mutateAsync({
        timeSlotId: selectedTimeSlot.id,
        bookingId: booking.id
      });
      
      toast.success("Booking confirmed! Redirecting to confirmation page...");
      setTimeout(() => {
        navigate("/booking-confirmation", { 
          state: { 
            booking: booking,
            service: selectedServiceData,
            timeSlot: selectedTimeSlot 
          }
        });
      }, 1500);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              {servicesLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <div className="flex gap-4">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-5 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                  </Card>
                ))
              ) : servicesError ? (
                <Card className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground mb-2">Failed to load services</p>
                  <p className="text-sm text-muted-foreground">Please refresh the page to try again.</p>
                </Card>
              ) : services.length > 0 ? (
                services.map((service: Service) => (
                  <Card 
                    key={service.id}
                    data-testid={`card-service-${service.id}`}
                    className={cn(
                      "p-4 cursor-pointer transition-luxury hover:shadow-elegant",
                      selectedService === service.id ? "ring-2 ring-secondary bg-card-luxury" : "bg-card"
                    )}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-luxury text-lg font-semibold text-primary">{service.name}</h3>
                        {service.description && (
                          <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          {service.estimatedDuration && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDuration(service.estimatedDuration)}
                            </Badge>
                          )}
                          <span className="text-lg font-bold text-secondary">
                            {formatPrice(service.price)}
                          </span>
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
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {!selectedDate ? (
                    <div className="col-span-2 text-center py-8">
                      <Clock className="w-8 h-8 text-accent mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2">Select a date first</p>
                      <p className="text-xs text-muted-foreground">Choose a date to see available time slots</p>
                    </div>
                  ) : timeSlotsLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))
                  ) : sortedTimeSlots.length > 0 ? (
                    sortedTimeSlots.map((slot: TimeSlot) => (
                      <Button
                        key={slot.id}
                        data-testid={`button-timeslot-${slot.id}`}
                        variant={selectedTimeSlot?.id === slot.id ? "luxury" : "elegant"}
                        className="justify-center text-sm"
                        onClick={() => setSelectedTimeSlot(slot)}
                        disabled={!slot.isAvailable || slot.currentBookings >= slot.maxCapacity}
                      >
                        <div className="flex flex-col items-center">
                          <span>{formatTimeSlot(slot)}</span>
                          {slot.maxCapacity > 1 && (
                            <span className="text-xs opacity-70">
                              {slot.maxCapacity - slot.currentBookings} left
                            </span>
                          )}
                        </div>
                      </Button>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <Clock className="w-8 h-8 text-accent mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2">No time slots available</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedDate && format(selectedDate, "MMMM d, yyyy")} has no available appointments
                      </p>
                    </div>
                  )}
                </div>
                {selectedDate && !timeSlotsLoading && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => refetchTimeSlots()}
                  >
                    <Loader2 className="w-4 h-4 mr-2" />
                    Refresh Available Times
                  </Button>
                )}
              </div>
            </div>
            
            {selectedDate && selectedTimeSlot && (
              <Card className="p-4 bg-card-luxury" data-testid="card-selected-datetime">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-secondary" />
                  <span className="font-medium text-primary">
                    {format(selectedDate, "MMMM d, yyyy")} at {formatTimeSlot(selectedTimeSlot)}
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
                    {selectedDate && format(selectedDate, "MMM d, yyyy")} at {selectedTimeSlot ? formatTimeSlot(selectedTimeSlot) : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-primary">
                    {selectedServiceData?.estimatedDuration ? formatDuration(selectedServiceData.estimatedDuration) : 'Varies'}
                  </span>
                </div>
                <div className="border-t border-accent-light pt-3 flex justify-between">
                  <span className="font-semibold text-primary">Total:</span>
                  <span className="font-bold text-lg text-secondary" data-testid="text-total-price">
                    {selectedServiceData ? formatPrice(selectedServiceData.price) : 'TBD'}
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
                data-testid={currentStep === 4 ? "button-confirm-booking" : "button-continue"}
                variant="luxury"
                className="flex-1"
                onClick={handleNext}
                disabled={
                  isSubmitting ||
                  (currentStep === 1 && !selectedService) ||
                  (currentStep === 2 && (!selectedDate || !selectedTimeSlot)) ||
                  (currentStep === 4 && !bookingData.paymentMethod)
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : currentStep === 4 ? "Confirm Booking" : "Continue"}
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