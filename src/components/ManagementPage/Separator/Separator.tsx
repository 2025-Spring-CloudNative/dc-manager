import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./Separator.module.scss";

const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      styles.separatorBase,
      orientation === "horizontal" ? styles.separatorHorizontal : styles.separatorVertical,
      className
    )}
    {...props}
  />
));
Separator.displayName = "Separator";

export { Separator };
