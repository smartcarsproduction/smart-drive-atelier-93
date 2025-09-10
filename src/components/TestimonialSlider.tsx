import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Array<{
    name: string;
    title: string;
    vehicle: string;
    rating: number;
    text: string;
  }> = [];

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

  if (testimonials.length === 0) {
    return (
      <div className="relative max-w-4xl mx-auto">
        <Card className="p-8 shadow-luxury bg-card-luxury">
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-accent mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No testimonials available</p>
            <p className="text-sm text-muted-foreground">Check back later for customer reviews</p>
          </div>
        </Card>
      </div>
    );
  }

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