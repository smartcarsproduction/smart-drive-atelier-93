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
  
  const services = {
    "ai-diagnostics": {
      icon: Brain,
      title: "AI Diagnostics",
      subtitle: "Advanced Artificial Intelligence Vehicle Analysis",
      description: "Our revolutionary AI diagnostic system represents the pinnacle of automotive technology, providing unprecedented insight into your vehicle's condition. Using machine learning algorithms trained on millions of data points, we deliver comprehensive analysis that goes far beyond traditional diagnostic methods.",
      features: [
        "Real-time system monitoring with 24/7 alerts",
        "Predictive failure analysis preventing costly repairs",
        "Performance optimization recommendations",
        "Digital health reports and maintenance scheduling",
        "Integration with manufacturer diagnostic protocols",
        "Historical trend analysis and reporting"
      ],
      price: "From $299",
      duration: "2-4 hours",
      warranty: "6 months diagnostic warranty",
      badge: "Popular",
      images: ["Advanced AI scanners", "Real-time monitoring dashboard", "Comprehensive reporting system"],
      process: [
        "Vehicle connectivity and system access",
        "Comprehensive AI analysis and data collection", 
        "Pattern recognition and predictive modeling",
        "Detailed reporting and recommendations"
      ],
      testimonial: {
        text: "The AI diagnostics caught an issue that would have cost me $8,000 in engine damage. Worth every penny.",
        author: "Michael Chen",
        title: "Tesla Model S Owner"
      }
    },
    "engine-rebuild": {
      icon: Wrench,
      title: "Engine Rebuild",
      subtitle: "Master Craftsmen Engine Restoration",
      description: "Our master craftsmen bring decades of experience to completely rebuild your engine to exceed factory specifications. Using only premium components and precision techniques, we restore your engine's power, efficiency, and reliability while maintaining its original character.",
      features: [
        "Complete engine disassembly and inspection",
        "Premium component replacement and upgrades",
        "Precision machining and balancing",
        "Performance enhancement options",
        "Comprehensive warranty coverage",
        "Detailed photo documentation of entire process"
      ],
      price: "From $8,999",
      duration: "2-4 weeks",
      warranty: "3 years / 100,000 miles",
      badge: "Premium",
      images: ["Clean room engine bay", "Master craftsmen at work", "Premium component selection"],
      process: [
        "Complete engine removal and disassembly",
        "Precision inspection and component analysis",
        "Machining, rebuilding, and enhancement",
        "Testing, installation, and performance validation"
      ],
      testimonial: {
        text: "They rebuilt my Ferrari's engine better than new. The attention to detail is extraordinary.",
        author: "Victoria Sterling",
        title: "Ferrari 488 Owner"
      }
    },
    "smart-customization": {
      icon: Palette,
      title: "Smart Customization",
      subtitle: "Personalized Luxury Vehicle Modifications",
      description: "Transform your vehicle into a unique expression of your personality and preferences. Our smart customization service combines aesthetic excellence with advanced technology integration, creating bespoke modifications that enhance both form and function.",
      features: [
        "Custom interior design and materials",
        "Performance modification packages",
        "Advanced technology integration",
        "Exclusive luxury materials and finishes",
        "Personalized lighting and ambiance",
        "Custom paint and exterior modifications"
      ],
      price: "From $2,499",
      duration: "1-3 weeks",
      warranty: "2 years comprehensive warranty",
      badge: "Exclusive",
      images: ["Custom interior designs", "Premium material selection", "Technology integration"],
      process: [
        "Personal consultation and design planning",
        "Material selection and component sourcing",
        "Precision installation and integration",
        "Quality testing and final detailing"
      ],
      testimonial: {
        text: "The custom interior they created is absolutely stunning. It's like driving in a luxury lounge.",
        author: "James Morrison",
        title: "Range Rover Owner"
      }
    },
    "emergency-assistance": {
      icon: Phone,
      title: "Emergency Assistance",
      subtitle: "24/7 Elite Roadside Support",
      description: "Our elite emergency assistance service provides round-the-clock support for luxury vehicle owners worldwide. With priority response times and luxury transportation options, we ensure you're never stranded without premium care.",
      features: [
        "24/7 global emergency response",
        "Priority dispatch and rapid response",
        "Luxury replacement vehicle provision",
        "Specialist technician deployment",
        "Concierge-level customer service",
        "Real-time tracking and communication"
      ],
      price: "$199/month",
      duration: "Immediate response",
      warranty: "Service guarantee",
      badge: "24/7",
      images: ["Emergency response vehicles", "Global coverage map", "Luxury transportation fleet"],
      process: [
        "Emergency call received and assessed",
        "Specialist technician dispatched",
        "On-site diagnosis and immediate assistance",
        "Follow-up service and resolution"
      ],
      testimonial: {
        text: "When my Bentley broke down in the middle of nowhere, they had me in a luxury loaner within an hour.",
        author: "Eleanor Hayes",
        title: "Bentley Continental Owner"
      }
    },
    "predictive-maintenance": {
      icon: Shield,
      title: "Predictive Maintenance",
      subtitle: "AI-Powered Preventive Care",
      description: "Our predictive maintenance service uses advanced AI algorithms to anticipate and prevent issues before they occur. By analyzing your vehicle's data patterns and usage, we maximize reliability while minimizing unexpected repairs and downtime.",
      features: [
        "Intelligent maintenance scheduling",
        "Automated parts pre-ordering",
        "Service reminders and notifications",
        "Warranty protection optimization",
        "Cost savings through prevention",
        "Detailed maintenance history tracking"
      ],
      price: "From $149/month",
      duration: "Ongoing monitoring",
      warranty: "Predictive accuracy guarantee",
      badge: "Smart",
      images: ["AI monitoring dashboard", "Maintenance scheduling system", "Parts inventory management"],
      process: [
        "Vehicle data collection and analysis",
        "Pattern recognition and prediction modeling",
        "Automated scheduling and parts ordering",
        "Proactive maintenance execution"
      ],
      testimonial: {
        text: "Haven't had a single unexpected breakdown since starting their predictive maintenance program.",
        author: "Dr. Patricia Williams",
        title: "Mercedes S-Class Owner"
      }
    },
    "concierge-service": {
      icon: Clock,
      title: "Concierge Service",
      subtitle: "White-Glove Automotive Care",
      description: "Experience the ultimate in luxury automotive service with our concierge program. From vehicle pickup and delivery to complete service coordination, we handle every detail so you can focus on what matters most to you.",
      features: [
        "Vehicle pickup and delivery service",
        "Complete service coordination",
        "Real-time progress updates",
        "Detailed service documentation",
        "Premium vehicle care during service",
        "Personalized customer service experience"
      ],
      price: "Included with premium services",
      duration: "Full service coordination",
      warranty: "Service satisfaction guarantee",
      badge: "Elite",
      images: ["White-glove vehicle transport", "Service coordination center", "Customer communication system"],
      process: [
        "Service consultation and planning",
        "Professional vehicle pickup",
        "Service execution with updates",
        "Quality inspection and delivery"
      ],
      testimonial: {
        text: "The concierge service is incredible. They picked up my car, serviced it perfectly, and returned it detailed.",
        author: "Alexander Thompson",
        title: "Porsche 911 Owner"
      }
    }
  };

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