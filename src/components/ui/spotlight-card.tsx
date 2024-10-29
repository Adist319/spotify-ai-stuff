"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  ({ className, children, as: Component = "div", ...props }, ref) => {
    const [position, setPosition] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const divRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!divRef.current) return;
      
      const rect = divRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setPosition({ x, y });
    };

    return (
      <Component
        ref={divRef}
        className={cn(
          "group relative rounded-xl overflow-hidden bg-zinc-900 p-6 border border-zinc-800",
          "transition-all duration-200 hover:border-zinc-700",
          className
        )}
        onMouseMove={handleMouseMove}
        {...props}
      >
        <div
          className="pointer-events-none absolute -inset-px transition duration-300 group-hover:opacity-100 opacity-0"
          style={{
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(34,197,94,0.1), transparent 40%)`
          }}
        />
        {children}
      </Component>
    );
  }
);

SpotlightCard.displayName = "SpotlightCard";

export { SpotlightCard }; 