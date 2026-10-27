import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-[17px] font-display font-bold transition-all disabled:pointer-events-none disabled:opacity-50 outline-none",
  {
    variants: {
      variant: {
        default:
          "rounded-6 bg-[#c8f135] text-[#403e0a] px-7 py-[13px] hover:opacity-90 shadow-sm",
        destructive:
          "rounded-6 bg-[#f65858] text-[#14140a] px-7 py-[13px] hover:bg-[#f65858]/90 shadow-sm",
        outline:
          "rounded-6 border border-[#e7e4d6] bg-white text-[#14140a] px-7 py-[13px] hover:bg-[#e7e4d6] shadow-sm",
        secondary:
          "rounded-6 bg-[#f5f1e0] text-[#403e0a] px-7 py-[13px] hover:bg-[#e7e4d6] shadow-sm",
        tertiary:
          "bg-[#a6e9ff] text-[#403e0a] px-7 py-[13px] hover:bg-[#a6e9ff]/90 rounded-6 shadow-sm",
        ghost: "hover:bg-[#f5f1e0] hover:text-[#c8f135] px-7 py-[13px]",
        link: "text-[#5b3fd6] underline-offset-4 hover:underline px-0 py-3",
      },
      size: {
        default: "h-auto min-h-[42px] px-7 py-[13px]",
        xs: "h-6 rounded-md px-2 text-xs",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
