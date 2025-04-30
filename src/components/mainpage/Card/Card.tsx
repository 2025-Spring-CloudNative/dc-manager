import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./Card.module.scss";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hovered?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, hovered, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(styles.cardBase, hovered && styles.cardHovered, className)}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = "Card";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.cardContent, className)} {...props}>
        {children}
      </div>
    );
  }
);
CardContent.displayName = "CardContent";

export { Card, CardContent };
