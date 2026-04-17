import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-black text-white",
        yellow: "bg-[oklch(0.88_0.17_90)] text-black",
        green: "bg-[oklch(0.55_0.14_155)] text-white",
        lavender: "bg-[oklch(0.88_0.08_290)] text-black",
        outline: "border border-black/15 bg-white text-black",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
