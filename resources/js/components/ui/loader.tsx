import React from 'react';
import { Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';

interface LoaderProps {
  size?: string;
  speed?: string;
  color?: string;
  className?: string;
}

export function Loader({
  size = "45",
  speed = "1.75",
  color = "black",
  className = ""
}: LoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Quantum
        size={size}
        speed={speed}
        color={color}
      />
    </div>
  );
}