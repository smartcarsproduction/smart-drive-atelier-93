import { Car } from "lucide-react";

interface CarLoadingAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const CarLoadingAnimation = ({ className = "", size = "md" }: CarLoadingAnimationProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={`relative ${className}`}>
      {/* Road/Track */}
      <div className="relative">
        <div className="w-32 h-1 bg-muted-foreground/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-transparent via-accent to-transparent w-8 animate-pulse"></div>
        </div>
        
        {/* Moving Car */}
        <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
          <Car 
            className={`${sizeClasses[size]} text-accent absolute -top-2 animate-car-drive`}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CarLoadingAnimation;