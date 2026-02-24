import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const brewButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'text-muted-foreground hover:bg-secondary hover:text-foreground',
        outline: 'border border-border bg-transparent hover:bg-secondary text-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        accent: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface BrewButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof brewButtonVariants> {}

export const BrewButton = forwardRef<HTMLButtonElement, BrewButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(brewButtonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
BrewButton.displayName = 'BrewButton';
