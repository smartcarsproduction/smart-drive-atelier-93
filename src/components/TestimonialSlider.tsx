import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "James Morrison",
      title: "CEO, Morrison Holdings",
      vehicle: "2024 Rolls-Royce Phantom",
      rating: 5,
      text: "Smart Cars transformed my Phantom beyond expectations. Their AI diagnostics caught issues my previous mechanic missed, and the craftsmanship is absolutely flawless. This is luxury automotive care redefined."
    },
    {
      name: "Sarah Chen",
      title: "Tech Executive",
      vehicle: "2023 Porsche 911 Turbo S",
      rating: 5,
      text: "The predictive maintenance system is revolutionary. They knew my Porsche needed attention before I even noticed anything. The white-glove service and attention to detail is unmatched in the industry."
    },
    {
      name: "Michael Rodriguez",
      title: "Investment Banker",
      vehicle: "2024 Mercedes-AMG GT",
      rating: 5,
      text: "Emergency roadside assistance saved my important client meeting. Within 20 minutes, they had me in a luxury loaner and my AMG GT was being transported to their facility. Exceptional service, every time."
    },
    {
      name: "Victoria Ashford",
      title: "Luxury Real Estate Broker",
      vehicle: "2023 Bentley Continental GT",
      rating: 5,
      text: "The customization work on my Continental GT is simply breathtaking. Smart Cars understood my vision perfectly and delivered beyond imagination. It's not just service, it's automotive artistry."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const prevTestimonial = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="p-8 shadow-luxury bg-card-luxury">
        <div className="text-center">
          {/* Stars */}
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
            ))}
          </div>

          {/* Testimonial Text */}
          <blockquote className="text-lg text-muted-foreground mb-6 leading-relaxed italic">
            "{testimonials[currentIndex].text}"
          </blockquote>

          {/* Author Info */}
          <div className="border-t border-accent-light pt-6">
            <p className="font-luxury text-lg font-semibold text-primary">
              {testimonials[currentIndex].name}
            </p>
            <p className="text-sm text-secondary font-medium mb-1">
              {testimonials[currentIndex].title}
            </p>
            <p className="text-sm text-muted-foreground">
              Owner of {testimonials[currentIndex].vehicle}
            </p>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-center space-x-4 mt-6">
        <Button
          variant="elegant"
          size="icon"
          onClick={prevTestimonial}
          className="rounded-full"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        {/* Dots */}
        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-luxury ${
                index === currentIndex ? "bg-secondary" : "bg-accent"
              }`}
            />
          ))}
        </div>
        
        <Button
          variant="elegant"
          size="icon"
          onClick={nextTestimonial}
          className="rounded-full"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TestimonialSlider;