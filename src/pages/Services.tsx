import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Brain, Wrench, Palette, Phone, Shield, Clock } from "lucide-react";
import { useWebsiteContent } from "@/lib/contentStore";

const Services = () => {
  const { content } = useWebsiteContent();

  const serviceIcons = [Brain, Wrench, Palette, Phone, Shield, Clock];

  const addons = [
    "Interior Detailing - ₹24,999",
    "Paint Protection Film - ₹1,08,999",
    "Ceramic Coating - ₹74,999",
    "Performance Tuning - ₹1,33,999",
    "Custom Exhaust - ₹1,91,999"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-luxury text-4xl md:text-6xl font-bold text-primary mb-6">
              {content.services.title}
              <span className="text-secondary block">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {content.services.subtitle}
            </p>
            <Link to="/booking">
              <Button variant="luxury" size="lg">Book Service Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-3xl md:text-4xl font-bold text-primary mb-4">
              Elite Service Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive luxury automotive care designed for India's most prestigious vehicles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.services.services.map((service, index) => {
              const IconComponent = serviceIcons[index % serviceIcons.length];
              return (
                <Card key={service.id} className="p-6 shadow-elegant hover:shadow-luxury transition-luxury bg-card-luxury group">
                  <div className="relative mb-6">
                    <div className="w-12 h-12 bg-gradient-luxury rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-luxury">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="absolute top-0 right-0 bg-secondary/10 text-secondary border-secondary/20"
                    >
                      Popular
                    </Badge>
                  </div>
                  
                  <h3 className="font-luxury text-xl font-semibold text-primary mb-3">{service.name}</h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1 h-1 bg-secondary rounded-full mr-3"></div>
                      Duration: {service.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-accent-light">
                    <span className="text-lg font-semibold text-secondary">{service.price}</span>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link to={`/services/${service.id}`} className="flex-1 sm:flex-none">
                        <Button variant="ghost" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Details</Button>
                      </Link>
                      <Link to="/booking" className="flex-1 sm:flex-none">
                        <Button variant="elegant" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Book Now</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-20 bg-background-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Service Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A meticulously crafted journey designed to exceed your expectations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Consultation",
                description: "Initial assessment and service planning with our experts"
              },
              {
                step: "2", 
                title: "Diagnostics",
                description: "AI-powered comprehensive analysis and detailed reporting"
              },
              {
                step: "3",
                title: "Service",
                description: "Expert craftsmen deliver precision work with premium materials"
              },
              {
                step: "4",
                title: "Delivery",
                description: "White-glove delivery with comprehensive service documentation"
              }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">{process.step}</span>
                </div>
                <h3 className="font-luxury text-lg font-semibold text-primary mb-2">{process.title}</h3>
                <p className="text-sm text-muted-foreground">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-on Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-3xl md:text-4xl font-bold text-primary mb-4">
              Premium Add-On Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enhance your service experience with our luxury add-on options
            </p>
          </div>
          
          <Card className="p-8 shadow-luxury bg-card-luxury max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-6">
            {addons.map((addon, index) => (
              <div key={index} className="flex flex-col sm:flex-row xl:flex-col items-center justify-between p-3 sm:p-4 bg-background rounded-luxury">
                <span className="text-muted-foreground text-sm sm:text-base text-center sm:text-left xl:text-center mb-2 sm:mb-0 xl:mb-2">{addon.split(' - ')[0]}</span>
                <span className="font-semibold text-secondary text-sm sm:text-base">{addon.split(' - ')[1]}</span>
              </div>
            ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-luxury text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Elevate Your Vehicle?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join the exclusive circle of automotive enthusiasts who trust Smart Cars for unparalleled luxury service across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button variant="luxury" size="lg">Book Service</Button>
            </Link>
            <Link to="/contact">
              <Button variant="elegant" size="lg">Request Quote</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;