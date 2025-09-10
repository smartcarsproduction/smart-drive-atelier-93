import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StatsCounter from "@/components/StatsCounter";
import TestimonialSlider from "@/components/TestimonialSlider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Award, Users, Leaf, ArrowRight, CheckCircle } from "lucide-react";
import { useWebsiteContent } from "@/lib/contentStore";
import heroImage from "@/assets/hero-luxury-car.jpg";

const Index = () => {
  const { content } = useWebsiteContent();

  const coreValues: Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  }> = [];

  const features: string[] = [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Luxury automotive workshop with pristine vehicles"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <h1 className="font-luxury text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight">
              {content.homepage.heroTitle}
              <span className="text-secondary block">{content.homepage.aboutTitle}</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/90 mb-6 sm:mb-8 leading-relaxed">
              {content.homepage.heroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row xl:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
              <Link to="/booking" className="w-full sm:w-auto">
                <Button variant="luxury" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                  {content.homepage.heroButton}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto">
                <Button variant="elegant" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                  Explore Services
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto xl:block hidden">
                <Button variant="hero" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                  Request Consultation
                </Button>
              </Link>
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-primary-foreground/80">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-secondary flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-luxury text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary mb-4">
              Excellence in Numbers
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Our commitment to luxury automotive excellence speaks through our achievements
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Card className="p-4 sm:p-6 lg:p-8 text-center shadow-elegant bg-card-luxury hover:shadow-luxury transition-luxury">
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary mb-2">
                <StatsCounter end={0} suffix="" />
              </div>
              <div className="text-base sm:text-lg font-medium text-primary mb-1">Cars Restored</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Luxury vehicles perfected</div>
            </Card>
            
            <Card className="p-4 sm:p-6 lg:p-8 text-center shadow-elegant bg-card-luxury hover:shadow-luxury transition-luxury">
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary mb-2">
                <StatsCounter end={0} />
              </div>
              <div className="text-base sm:text-lg font-medium text-primary mb-1">Years of Excellence</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Pioneering AI-driven care</div>
            </Card>
            
            <Card className="p-4 sm:p-6 lg:p-8 text-center shadow-elegant bg-card-luxury hover:shadow-luxury transition-luxury">
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary mb-2">
                <StatsCounter end={0} suffix="" />
              </div>
              <div className="text-base sm:text-lg font-medium text-primary mb-1">Satisfaction Rate</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Elite client approval</div>
            </Card>
            
            <Card className="p-4 sm:p-6 lg:p-8 text-center shadow-elegant bg-card-luxury hover:shadow-luxury transition-luxury">
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary mb-2">-</div>
              <div className="text-base sm:text-lg font-medium text-primary mb-1">Elite Support</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Always available assistance</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-3xl md:text-5xl font-bold text-primary mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every aspect of our luxury automotive services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="p-8 text-center shadow-elegant hover:shadow-luxury transition-luxury group">
                  <div className="w-16 h-16 bg-gradient-luxury rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-luxury">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-luxury text-xl font-semibold text-primary mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workshop Showcase */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-luxury text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
                State-of-the-Art
                <span className="text-secondary block">Workshop</span>
              </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 leading-relaxed">
              Our Mumbai facility features the most advanced automotive technology, 
              combining AI-powered diagnostics with artisanal craftsmanship spaces designed 
              for the world's most prestigious vehicles.
            </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Climate-controlled luxury bays",
                  "Advanced AI diagnostic systems", 
                  "Master craftsmen workspace",
                  "Premium parts inventory"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span className="text-primary-foreground/90">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/about">
                  <Button variant="luxury" size="lg">Learn More</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="elegant" size="lg">Schedule Visit</Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-8 shadow-luxury bg-card/10 backdrop-blur-md border-secondary/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-luxury text-2xl font-bold text-primary-foreground mb-4">
                    Certified Excellence
                  </h3>
                  <p className="text-primary-foreground/80 mb-6">
                    Factory-certified technicians trained on every luxury marque, 
                    ensuring your investment receives the expertise it deserves.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">15+</div>
                      <div className="text-sm text-primary-foreground/80">Luxury Brands</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">50+</div>
                      <div className="text-sm text-primary-foreground/80">Certifications</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-3xl md:text-5xl font-bold text-primary mb-4">
              What Our Elite Clients Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Testimonials from discerning automotive enthusiasts who trust Smart Cars
            </p>
          </div>
          
          <TestimonialSlider />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-luxury text-3xl md:text-5xl font-bold text-primary mb-6">
            Join the Smart Cars Elite Club
          </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the pinnacle of luxury automotive care in India. From AI-powered diagnostics 
              to bespoke customizations, discover why India's most discerning clients 
              choose Smart Cars for their prized vehicles.
            </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button variant="hero" size="lg" className="text-lg px-8">
                Book Your Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="elegant" size="lg" className="text-lg px-8">
                Create Elite Account
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-primary/60">
            <p>Emergency Support: <span className="font-medium text-primary">Contact Information Not Available</span></p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;