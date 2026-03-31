import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition duration-300",
        "hover:-translate-y-1 hover:border-[var(--ft-purple)]/50 hover:bg-white/[0.11]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-[var(--ft-blue)]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-[var(--ft-yellow)]/10 blur-3xl" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}