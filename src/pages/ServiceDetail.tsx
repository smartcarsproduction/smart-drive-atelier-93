import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, Wrench, Palette, Phone, Shield, Clock, Check, ArrowLeft, Star } from "lucide-react";

const ServiceDetail = () => {
  const { serviceId } = useParams();
  
  const services: Record<string, {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    price: string;
    duration: string;
    warranty: string;
    badge: string;
    images: string[];
    process: string[];
    testimonial: {
      text: string;
      author: string;
      title: string;
    };
  }> = {};

  const service = services[serviceId as keyof typeof services];

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Service Not Found</h1>
          <Link to="/services">
            <Button variant="luxury">View All Services</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent = service.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/services" className="flex items-center text-muted-foreground hover:text-primary transition-colors mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-luxury rounded-xl flex items-center justify-center mr-4">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                  {service.badge}
                </Badge>
              </div>
              
              <h1 className="font-luxury text-4xl md:text-5xl font-bold text-primary mb-4">
                {service.title}
              </h1>
              <p className="text-xl text-secondary font-medium mb-6">
                {service.subtitle}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {service.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/booking">
                  <Button variant="luxury" size="lg">Book This Service</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="elegant" size="lg">Request Quote</Button>
                </Link>
              </div>
            </div>
            
            <Card className="p-8 shadow-luxury bg-card-luxury">
              <h3 className="font-luxury text-xl font-bold text-primary mb-6">Service Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-accent-light">
                  <span className="text-muted-foreground">Starting Price</span>
                  <span className="text-2xl font-bold text-secondary">{service.price}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-accent-light">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium text-primary">{service.duration}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground">Warranty</span>
                  <span className="font-medium text-primary">{service.warranty}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-luxury text-3xl font-bold text-primary mb-12 text-center">
            What's Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-luxury rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-background-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-luxury text-3xl font-bold text-primary mb-12 text-center">
            Our Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {service.process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">{index + 1}</span>
                </div>
                <p className="text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 shadow-luxury bg-card-luxury text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-secondary fill-current" />
              ))}
            </div>
            <blockquote className="text-lg text-muted-foreground mb-6 italic">
              "{service.testimonial.text}"
            </blockquote>
            <div className="text-center">
              <p className="font-semibold text-primary">{service.testimonial.author}</p>
              <p className="text-sm text-muted-foreground">{service.testimonial.title}</p>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-luxury text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Experience {service.title}?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join the exclusive circle of automotive enthusiasts who trust Smart Cars for unparalleled luxury service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button variant="luxury" size="lg">Book Service Now</Button>
            </Link>
            <Link to="/contact">
              <Button variant="elegant" size="lg">Get Custom Quote</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;