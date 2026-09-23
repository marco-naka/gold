import { cn } from './cn';

export default function GlassCard({ className, hover = true, children, ...props }) {
  return (
    <div className={cn('glass', hover && 'glass-hover', className)} {...props}>
      {children}
    </div>
  );
}
