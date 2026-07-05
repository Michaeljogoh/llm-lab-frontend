import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[transform,background-color,color,opacity,border-color] duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-primary text-primary-foreground hover:opacity-90",
        destructive:
          "rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "rounded-full border border-border bg-background text-foreground hover:border-foreground hover:bg-foreground hover:text-background dark:hover:border-white/30 dark:hover:bg-white/10 dark:hover:text-foreground",
        secondary:
          "rounded-full bg-secondary text-secondary-foreground hover:opacity-90 dark:hover:bg-white/10",
        ghost:
          "rounded-md text-foreground hover:bg-foreground hover:text-background dark:hover:bg-white/10 dark:hover:text-foreground",
        link: "text-action-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-5",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-7",
        icon: "size-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
