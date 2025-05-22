import React, { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number; // ms
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (value === displayValue) return;
    cancelAnimationFrame(rafRef.current!);
    startValueRef.current = displayValue;
    startTimeRef.current = performance.now();
    
    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      if (elapsed >= duration) {
        setDisplayValue(value);
        return;
      }
      const progress = elapsed / duration;
      const next = startValueRef.current + (value - startValueRef.current) * progress;
      setDisplayValue(next);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
  if (rafRef.current) {
    cancelAnimationFrame(rafRef.current);
  }
};
    // eslint-disable-next-line
  }, [value, duration]);

  // Format with commas and decimals
  const formatted = `${prefix}${displayValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;

  return <span className={className}>{formatted}</span>;
};

export default AnimatedNumber;
