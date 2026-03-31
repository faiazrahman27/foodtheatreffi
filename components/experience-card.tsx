import { GlassCard } from "@/components/glass-card";

interface ExperienceCardProps {
  title: string;
  city: string;
  type: string;
  description: string;
  accent: string;
}

export function ExperienceCard({
  title,
  city,
  type,
  description,
  accent,
}: ExperienceCardProps) {
  return (
    <GlassCard className="min-h-[320px] p-0 overflow-hidden">
      <div
        className="h-40 w-full"
        style={{
          background: `linear-gradient(135deg, ${accent}33 0%, rgba(255,255,255,0.04) 100%)`,
        }}
      />

      <div className="p-6">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-white/50">
          <span>{city}</span>
          <span>•</span>
          <span>{type}</span>
        </div>

        <h3 className="mt-4 text-2xl font-semibold">{title}</h3>

        <p className="mt-4 leading-7 text-white/75">{description}</p>

        <button className="mt-6 text-sm font-medium text-white/85 transition hover:text-white">
          View Experience →
        </button>
      </div>
    </GlassCard>
  );
}