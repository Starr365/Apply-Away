"use client";

import { useSpring, animated, type SpringConfig } from "@react-spring/web";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedContainerProps {
  children: ReactNode;
  /** Delay before animation starts in ms */
  delay?: number;
  /** Animation direction: slide from bottom, left, right, or just fade */
  direction?: "up" | "left" | "right" | "fade";
  /** Distance of the slide in px */
  distance?: number;
  /** Spring config override */
  config?: SpringConfig;
  /** Additional CSS class names */
  className?: string;
}

const DEFAULT_CONFIG: SpringConfig = {
  tension: 280,
  friction: 24,
};

export function AnimatedContainer({
  children,
  delay = 0,
  direction = "up",
  distance = 20,
  config = DEFAULT_CONFIG,
  className,
}: AnimatedContainerProps) {
  const getTransform = () => {
    switch (direction) {
      case "up":
        return { from: `translateY(${distance}px)`, to: "translateY(0px)" };
      case "left":
        return { from: `translateX(${distance}px)`, to: "translateX(0px)" };
      case "right":
        return { from: `translateX(-${distance}px)`, to: "translateX(0px)" };
      case "fade":
      default:
        return { from: "translateY(0px)", to: "translateY(0px)" };
    }
  };

  const { from, to } = getTransform();

  const spring = useSpring({
    from: { opacity: 0, transform: from },
    to: { opacity: 1, transform: to },
    delay,
    config,
  });

  return (
    <animated.div style={spring} className={cn(className)}>
      {children}
    </animated.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Staggered Children Wrapper                                                */
/* -------------------------------------------------------------------------- */

interface StaggeredListProps {
  children: ReactNode[];
  /** Delay between each child in ms */
  staggerDelay?: number;
  /** Base delay before first child in ms */
  baseDelay?: number;
  direction?: "up" | "left" | "right" | "fade";
  className?: string;
}

export function StaggeredList({
  children,
  staggerDelay = 60,
  baseDelay = 0,
  direction = "up",
  className,
}: StaggeredListProps) {
  return (
    <div className={cn(className)}>
      {children.map((child, index) => (
        <AnimatedContainer
          key={index}
          delay={baseDelay + index * staggerDelay}
          direction={direction}
        >
          {child}
        </AnimatedContainer>
      ))}
    </div>
  );
}
