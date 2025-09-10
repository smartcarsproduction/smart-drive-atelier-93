import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, MessageCircle, Shield, Zap } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! Our concierge team will contact you within 2 hours.");
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "24/7 Emergency Helpline",
      details: "+91 98765-43210",
      description: "Immediate assistance for urgent automotive needs across India",
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Premium Concierge",
      details: "premium@smartcarselite.co.in",
      description: "Personalized service coordination and inquiries",
      action: "Email Us"
    },
    {
      icon: MapPin,
      title: "Mumbai Service Center",
      details: "Phoenix Mills Compound, Lower Parel, Mumbai - 400013, Maharashtra",
      description: "Visit our flagship luxury service center",
      action: "Get Directions"
    },
    {
      icon: Clock,
      title: "Service Hours (IST)",
      details: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM",
      description: "Extended hours for premium members",
      action: "Schedule Visit"
    }
  ];

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Exclusive Consultation",
      description: "One-on-one consultation for luxury vehicle customization",
      buttonText: "Book Consultation"
    },
    {
      icon: Shield,
      title: "Emergency Help",
      description: "Immediate roadside assistance and emergency services",
      buttonText: "Request Help"
    },
    {
      icon: Zap,
      title: "VIP Quote Request",
      description: "Priority pricing for comprehensive service packages",
      buttonText: "Get VIP Quote"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-luxury text-4xl md:text-6xl font-bold text-primary mb-6">
              Elite Customer
              <span className="text-secondary block">Support</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Experience personalized support from our dedicated concierge team. 
              We're available 24/7 to ensure your luxury automotive needs are met with precision and care.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="font-luxury text-3xl font-bold text-primary mb-8">
              Get in Touch
            </h2>
            
            <div className="space-y-6">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <Card key={index} className="p-6 shadow-elegant hover:shadow-luxury transition-luxury group">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-luxury rounded-xl flex items-center justify-center group-hover:scale-110 transition-luxury">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-luxury text-lg font-semibold text-primary mb-1">
                          {method.title}
                        </h3>
                        <p className="text-secondary font-medium mb-2">{method.details}</p>
                        <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                        <Button variant="elegant" size="sm">{method.action}</Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-12">
              <h3 className="font-luxury text-xl font-semibold text-primary mb-6">
                Quick Actions
              </h3>
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Card key={index} className="p-4 shadow-elegant bg-card-luxury">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-luxury rounded-lg flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-primary">{action.title}</h4>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                        <Button variant="luxury" size="sm">{action.buttonText}</Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="p-8 shadow-luxury bg-card/80 backdrop-blur-md">
              <h2 className="font-luxury text-2xl font-bold text-primary mb-6">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-primary font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Raj"
                      className="bg-background border-accent-light focus:border-secondary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-primary font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Sharma"
                      className="bg-background border-accent-light focus:border-secondary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="raj.sharma@gmail.com"
                    className="bg-background border-accent-light focus:border-secondary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-primary font-medium">Mobile Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765-43210"
                    className="bg-background border-accent-light focus:border-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-primary font-medium">Subject</Label>
                  <Select>
                    <SelectTrigger className="bg-background border-accent-light focus:border-secondary">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Premium Consultation</SelectItem>
                      <SelectItem value="emergency">Emergency Roadside Assistance</SelectItem>
                      <SelectItem value="quote">VIP Service Quote</SelectItem>
                      <SelectItem value="service">General Service Inquiry</SelectItem>
                      <SelectItem value="customization">Vehicle Customization</SelectItem>
                      <SelectItem value="insurance">Insurance Claims Support</SelectItem>
                      <SelectItem value="warranty">Warranty Service</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle" className="text-primary font-medium">Vehicle Information (Optional)</Label>
                  <Input
                    id="vehicle"
                    placeholder="e.g., 2024 Tata Harrier, Mahindra XUV700, BMW X3"
                    className="bg-background border-accent-light focus:border-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-primary font-medium">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your needs, questions, or how we can assist you..."
                    rows={5}
                    className="bg-background border-accent-light focus:border-secondary resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary font-medium">Upload Files (Optional)</Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    className="bg-background border-accent-light focus:border-secondary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload images, documents, or specifications (Max 10MB per file)
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="priority" 
                    className="rounded border-accent-light text-secondary focus:ring-secondary"
                  />
                  <Label htmlFor="priority" className="text-sm text-muted-foreground cursor-pointer">
                    This is a priority request (2-hour response time)
                  </Label>
                </div>

                <Button type="submit" variant="luxury" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Response Time */}
            <Card className="mt-6 p-4 bg-gradient-luxury border-secondary/20">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-primary">Guaranteed Response</p>
                  <p className="text-xs text-primary/80">
                    Standard inquiries: Within 4 hours • Priority requests: Within 2 hours
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="p-8 shadow-luxury">
            <h2 className="font-luxury text-2xl font-bold text-primary mb-6 text-center">
              Visit Our Mumbai Service Center
            </h2>
            <div className="bg-accent-light rounded-luxury h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-secondary mx-auto mb-4" />
                <p className="text-lg font-medium text-primary mb-2">Phoenix Mills Compound</p>
                <p className="text-muted-foreground mb-4">Lower Parel, Mumbai - 400013, Maharashtra, India</p>
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                  <Button variant="luxury">Get Directions</Button>
                  <Button variant="elegant">Call Service Center</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;