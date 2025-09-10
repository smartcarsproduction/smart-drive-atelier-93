import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Award, Users, Zap, Leaf } from "lucide-react";

const About = () => {
  const milestones = [
    { year: "2020", title: "Founded", description: "Smart Cars established with vision for AI-driven luxury automotive care in India" },
    { year: "2021", title: "First AI System", description: "Launched revolutionary diagnostic AI technology adapted for Indian road conditions" },
    { year: "2022", title: "Elite Recognition", description: "Became preferred service provider for luxury car manufacturers in Indian market" },
    { year: "2023", title: "Innovation Awards", description: "Received multiple industry awards for technological advancement in automotive AI" },
    { year: "2024", title: "National Expansion", description: "Opening luxury service centers in major Indian metropolitan cities" },
  ];

  const values = [
    {
      icon: Zap,
      title: "Innovation",
      description: "Pioneering AI-driven automotive solutions that set new industry standards."
    },
    {
      icon: Award,
      title: "Precision",
      description: "Meticulous attention to detail in every service and customization."
    },
    {
      icon: Users,
      title: "Excellence",
      description: "Delivering unparalleled luxury experiences that exceed expectations."
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Committed to environmentally conscious luxury automotive solutions."
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
              Our Story of
              <span className="text-secondary block">Automotive Excellence</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Smart Cars was born from a vision to revolutionize luxury automotive care in India through 
              the perfect fusion of artificial intelligence, precision engineering, and timeless craftsmanship.
            </p>
            <Link to="/services">
              <Button variant="luxury" size="lg">Explore Our Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-luxury text-3xl md:text-4xl font-bold text-primary mb-6">
                Mission & Vision
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-luxury text-xl font-semibold text-secondary mb-3">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To redefine luxury automotive care in India by seamlessly integrating cutting-edge AI technology 
                    with artisanal craftsmanship, delivering personalized experiences that honor both 
                    innovation and tradition.
                  </p>
                </div>
                <div>
                  <h3 className="font-luxury text-xl font-semibold text-secondary mb-3">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To become India's most trusted partner for luxury automotive enthusiasts, 
                    setting new standards for precision, innovation, and sustainable luxury in 
                    the Indian automotive industry.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="p-8 shadow-luxury bg-card-luxury">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-luxury text-2xl font-bold text-primary mb-4">Elite Recognition</h3>
                  <p className="text-muted-foreground mb-6">
                    Trusted by luxury car manufacturers and discerning clients across India
                  </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-secondary">500+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Cars Restored</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-secondary">98%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-secondary">24/7</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Support</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-secondary">15+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Luxury Brands</div>
            </div>
          </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-background-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Journey of Innovation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Milestones that have shaped our commitment to luxury automotive excellence
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-secondary hidden md:block"></div>
            
            <div className="space-y-12 md:space-y-16">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex flex-col items-center text-center md:text-left">
                  <div className={`w-full max-w-md md:max-w-lg lg:max-w-xl ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <Card className="p-4 sm:p-6 shadow-elegant bg-card hover:shadow-luxury transition-luxury">
                      <div className="text-xl sm:text-2xl font-bold text-secondary mb-2">{milestone.year}</div>
                      <h3 className="font-luxury text-lg sm:text-xl font-semibold text-primary mb-3">{milestone.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{milestone.description}</p>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every aspect of our luxury automotive services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="p-6 text-center shadow-elegant hover:shadow-luxury transition-luxury bg-card-luxury">
                  <div className="w-12 h-12 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-luxury text-lg font-semibold text-primary mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-luxury text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Experience Smart Cars?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join the elite circle of automotive enthusiasts who trust Smart Cars for unparalleled luxury service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services">
              <Button variant="luxury" size="lg">Explore Services</Button>
            </Link>
            <Link to="/contact">
              <Button variant="elegant" size="lg">Book Consultation</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;