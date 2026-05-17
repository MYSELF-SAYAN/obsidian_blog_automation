import * as React from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export default function Spinner({ size = "sm", className, ...props }: SpinnerProps) {
  const sizeClass = size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6";
  return (
    <div
      aria-hidden
      className={`${sizeClass} inline-block animate-spin rounded-full border-2 border-t-transparent border-primary ${className ?? ""}`}
      {...props}
    />
  );
}
