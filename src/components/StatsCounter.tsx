import { useEffect, useState } from "react";

interface StatsCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

const StatsCounter = ({ end, duration = 2000, suffix = "", prefix = "" }: StatsCounterProps) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
          let start = 0;
          const increment = end / (duration / 16); // 60fps
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [end, duration, hasStarted]);

  return (
    <span id={`counter-${end}`} className="inline-block">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default StatsCounter;