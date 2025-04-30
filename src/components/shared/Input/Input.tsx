import React from "react";
import { cn } from "@/lib/utils";
import styles from "./Input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(styles.inputBase, className)}
      {...props}
    />
  );
});
Input.displayName = "Input";
