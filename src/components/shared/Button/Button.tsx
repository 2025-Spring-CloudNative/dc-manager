import React from "react";
import { cn } from "@/lib/utils";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(styles.buttonBase, className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";


export default Button;