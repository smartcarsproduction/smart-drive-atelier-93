import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="bg-gradient-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="font-luxury text-2xl font-semibold text-primary mb-4">
              Join the Smart Cars Elite Club
            </h3>
            <p className="text-primary/80 mb-6 max-w-2xl mx-auto">
              Get exclusive updates on premium automotive care, AI innovations, and luxury service offerings across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email (e.g., raj@gmail.com)"
                className="bg-background/90 border-0 text-foreground flex-1"
              />
              <Button variant="hero" className="w-full sm:w-auto sm:px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-secondary rounded-md flex items-center justify-center">
                <span className="text-primary font-bold text-lg">S</span>
              </div>
              <span className="font-luxury text-xl font-semibold">Smart Cars Elite</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Redefining the future of luxury automotive care through AI diagnostics, 
              precision engineering, and timeless craftsmanship.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-primary-foreground/60 hover:text-secondary transition-luxury cursor-pointer" />
              <Twitter className="w-5 h-5 text-primary-foreground/60 hover:text-secondary transition-luxury cursor-pointer" />
              <Instagram className="w-5 h-5 text-primary-foreground/60 hover:text-secondary transition-luxury cursor-pointer" />
              <Linkedin className="w-5 h-5 text-primary-foreground/60 hover:text-secondary transition-luxury cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-luxury text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Services", path: "/services" },
                { name: "Contact", path: "/contact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block text-primary-foreground/80 hover:text-secondary transition-luxury text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-luxury text-lg font-semibold">Services</h4>
            <div className="space-y-2">
              {[
                "AI Diagnostics",
                "Engine Rebuild",
                "Smart Customization",
                "Emergency Assistance",
                "Predictive Maintenance",
              ].map((service) => (
                <Link
                  key={service}
                  to="/services"
                  className="block text-primary-foreground/80 hover:text-secondary transition-luxury text-sm"
                >
                  {service}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-luxury text-lg font-semibold">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-secondary" />
                <div>
                  <p className="text-sm text-primary-foreground/80">24/7 Helpline</p>
                  <p className="text-sm font-medium">+91 98765-43210</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-secondary" />
                <div>
                  <p className="text-sm text-primary-foreground/80">Email</p>
                  <p className="text-sm font-medium">premium@smartcarselite.co.in</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-secondary" />
                <div>
                  <p className="text-sm text-primary-foreground/80">Service Center</p>
                  <p className="text-sm font-medium">Lower Parel, Mumbai</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 Smart Cars Elite. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="#" className="text-primary-foreground/60 hover:text-secondary transition-luxury text-sm">
                Privacy Policy
              </Link>
              <Link to="#" className="text-primary-foreground/60 hover:text-secondary transition-luxury text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;