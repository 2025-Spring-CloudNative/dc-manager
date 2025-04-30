import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./Card.module.scss";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(styles.card, className)} {...props} />
  )
);
Card.displayName = "Card";

export { Card };
