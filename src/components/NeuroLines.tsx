import { motion } from "framer-motion";

type Props = {
  className?: string;
  variant?: "circles" | "wave" | "constellation";
  opacity?: number;
};

/**
 * Декоративные нейро-линии — тонкая отсылка к нейрографике в фоне секций.
 * Чисто декоративные SVG, без интерактива и без текста.
 */
const NeuroLines = ({ className = "", variant = "circles", opacity = 0.18 }: Props) => {
  if (variant === "wave") {
    return (
      <svg
        aria-hidden
        className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        style={{ opacity }}
      >
        <defs>
          <linearGradient id="nl-wave" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="hsl(320 75% 55%)" />
            <stop offset="50%" stopColor="hsl(230 70% 60%)" />
            <stop offset="100%" stopColor="hsl(165 55% 50%)" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.path
            key={i}
            d={`M0,${260 + i * 18} C300,${180 + i * 14} 600,${360 - i * 18} 1200,${240 + i * 16}`}
            fill="none"
            stroke="url(#nl-wave)"
            strokeWidth={1}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, delay: i * 0.15, ease: "easeOut" }}
          />
        ))}
      </svg>
    );
  }

  if (variant === "constellation") {
    return (
      <svg
        aria-hidden
        className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity }}
      >
        <g stroke="hsl(var(--primary))" strokeWidth={0.6} fill="none">
          <path d="M120,140 L260,210 L380,120 L520,260 L660,180" />
          <path d="M260,210 L300,360 L440,420 L520,260" />
          <path d="M120,140 L100,300 L300,360" />
        </g>
        {[
          [120, 140], [260, 210], [380, 120], [520, 260], [660, 180],
          [300, 360], [440, 420], [100, 300],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill="hsl(var(--primary))" />
        ))}
      </svg>
    );
  }

  // circles (default)
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="nl-stroke" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(320 75% 55%)" />
          <stop offset="100%" stopColor="hsl(230 70% 60%)" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#nl-stroke)" strokeWidth={0.7} className="neuro-rotate-slow" style={{ transformOrigin: "400px 400px" }}>
        <circle cx="400" cy="400" r="120" />
        <circle cx="400" cy="400" r="180" />
        <circle cx="400" cy="400" r="260" />
        <circle cx="400" cy="400" r="340" />
      </g>
      <g fill="none" stroke="hsl(var(--secondary))" strokeWidth={0.5} className="neuro-rotate-reverse" style={{ transformOrigin: "400px 400px" }}>
        <ellipse cx="400" cy="400" rx="320" ry="140" />
        <ellipse cx="400" cy="400" rx="140" ry="320" />
      </g>
    </svg>
  );
};

export default NeuroLines;
