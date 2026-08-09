"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Base styles with smooth transitions and click scale effects
    const baseStyles =
      "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer active:scale-[0.98]";

    // Variant color mappings adhering strictly to brand design tokens & high contrast
    const variantStyles = {
      // Primary: Vibrant Deep Sky Blue with ultra-high contrast dark text
      primary:
        "bg-primary text-slate-950 hover:bg-primary/90 shadow-md shadow-primary/25 border border-primary/30",
      // Secondary: Deep Space / Charcoal surface with crisp foreground text
      secondary:
        "bg-secondary text-foreground hover:bg-secondary/80 border border-border shadow-xs",
      // Outline: High-contrast primary border outline
      outline:
        "bg-transparent border border-primary/50 text-primary hover:bg-primary/10",
      // Ghost: Subdued background hover
      ghost:
        "bg-transparent text-foreground hover:bg-secondary hover:text-foreground",
      // Destructive: Bold, high-contrast red action
      destructive:
        "bg-red-500 hover:bg-red-700 text-white font-extrabold shadow-md shadow-red-600/30 border border-red-500/30",
    };

    // Size dimensions
    const sizeStyles = {
      sm: "h-9 px-3 text-xs space-x-1.5",
      md: "h-11 px-5 text-xs sm:text-sm space-x-2",
      lg: "h-12 px-6 text-sm space-x-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
