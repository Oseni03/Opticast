import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const card = cva(
  "rounded-xl border border-[#e7e4d6] bg-white text-[#14140a] flex flex-col p-6",
  {
    variants: {
      variant: {
        default: "p-6",
        plan: "rounded-[14px] shadow-[0_2px_10px_rgba(30,30,45,0.08)] border-b-[5px] border-b-[#b9a4f2] p-[18px]",
        feature: "p-[20px] gap-[16px]",
        audio:
          "shadow-[0_2px_12px_rgba(30,30,45,0.10)] p-[18px] gap-6 overflow-hidden",
        soft: "p-[20px_28px] rounded-[14px] shadow-[0_2px_10px_rgba(30,30,45,0.08)] border-b-[5px] border-b-[#3dbe8b] font-display font-bold",
        elevated: "p-10 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof card> {}

function Card({ className, variant, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(card({ variant, className }))}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-2",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-display font-bold leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-[#5a5a66] font-body", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
