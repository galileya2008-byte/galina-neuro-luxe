import { motion } from "framer-motion";

const OUTER_PETAL =
  "M 200 218 C 186 178 178 118 200 58 C 222 118 214 178 200 218 Z";

const INNER_PETAL =
  "M 200 212 C 193 188 192 148 200 118 C 208 148 207 188 200 212 Z";

const OUTER_COLORS = [
  { base: "hsl(345 48% 52%)", tip: "hsl(345 55% 68%)", shadow: "hsl(345 42% 38%)" },
  { base: "hsl(350 45% 55%)", tip: "hsl(350 52% 72%)", shadow: "hsl(345 42% 38%)" },
  { base: "hsl(340 42% 50%)", tip: "hsl(340 50% 66%)", shadow: "hsl(345 42% 38%)" },
  { base: "hsl(355 40% 54%)", tip: "hsl(355 48% 70%)", shadow: "hsl(345 42% 38%)" },
  { base: "hsl(330 38% 52%)", tip: "hsl(330 46% 68%)", shadow: "hsl(345 42% 38%)" },
  { base: "hsl(348 46% 53%)", tip: "hsl(348 54% 69%)", shadow: "hsl(345 42% 38%)" },
  { base: "hsl(342 44% 51%)", tip: "hsl(342 52% 67%)", shadow: "hsl(345 42% 38%)" },
  { base: "hsl(352 43% 54%)", tip: "hsl(352 50% 71%)", shadow: "hsl(345 42% 38%)" },
];

type LotusFlowerProps = {
  onPetalClick: (index: number) => void;
  isRevealing: boolean;
  disabled?: boolean;
};

const LotusFlower = ({ onPetalClick, isRevealing, disabled }: LotusFlowerProps) => {
  const petalCount = 8;

  return (
    <motion.svg
      viewBox="0 0 400 400"
      className="w-full h-full drop-shadow-elegant"
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={false}
      role="img"
      aria-label="Интерактивный лотос — выберите лепесток"
    >
      <defs>
        {OUTER_COLORS.map((c, i) => (
          <linearGradient key={`grad-${i}`} id={`petal-grad-${i}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={c.shadow} stopOpacity="0.95" />
            <stop offset="45%" stopColor={c.base} />
            <stop offset="100%" stopColor={c.tip} />
          </linearGradient>
        ))}
        <radialGradient id="lotus-center" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="hsl(42 75% 78%)" />
          <stop offset="55%" stopColor="hsl(38 62% 52%)" />
          <stop offset="100%" stopColor="hsl(345 42% 38%)" />
        </radialGradient>
        <radialGradient id="lotus-pad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(152 28% 42%)" />
          <stop offset="100%" stopColor="hsl(152 32% 28%)" />
        </radialGradient>
        <filter id="petal-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="hsl(258 28% 14% / 0.18)" />
        </filter>
      </defs>

      {/* Lily pad */}
      <ellipse
        cx="200"
        cy="248"
        rx="148"
        ry="42"
        fill="url(#lotus-pad)"
        opacity="0.88"
        transform="rotate(-8 200 248)"
      />
      <ellipse
        cx="200"
        cy="252"
        rx="120"
        ry="28"
        fill="hsl(152 35% 36%)"
        opacity="0.35"
        transform="rotate(-8 200 252)"
      />

      {/* Inner decorative petals */}
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = i * (360 / petalCount) + 22.5;
        return (
          <g key={`inner-${i}`} transform={`rotate(${angle} 200 200)`} filter="url(#petal-soft-shadow)">
            <path
              d={INNER_PETAL}
              fill={`url(#petal-grad-${i})`}
              opacity="0.72"
            />
          </g>
        );
      })}

      {/* Outer clickable petals */}
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = i * (360 / petalCount) - 90;
        return (
          <motion.g
            key={`outer-${i}`}
            transform={`rotate(${angle} 200 200)`}
            style={{ transformOrigin: "200px 200px" }}
            whileHover={disabled ? undefined : { scale: 1.05 }}
            whileTap={disabled ? undefined : { scale: 0.98 }}
            animate={
              isRevealing
                ? { scale: [1, 1.03, 1], opacity: [1, 0.8, 1] }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.45 }}
          >
            <path
              d={OUTER_PETAL}
              fill={`url(#petal-grad-${i})`}
              stroke="hsl(0 0% 100% / 0.35)"
              strokeWidth="1.2"
              filter="url(#petal-soft-shadow)"
              className={disabled ? "cursor-default" : "cursor-pointer"}
              onClick={() => !disabled && onPetalClick(i)}
              role="button"
              aria-label={`Лепесток ${i + 1}`}
            />
          </motion.g>
        );
      })}

      {/* Center — seed pod & stamens */}
      <circle cx="200" cy="200" r="34" fill="url(#lotus-center)" filter="url(#petal-soft-shadow)" />
      <circle cx="200" cy="200" r="22" fill="hsl(42 70% 62% / 0.55)" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x1 = 200 + Math.cos(a) * 10;
        const y1 = 200 + Math.sin(a) * 10;
        const x2 = 200 + Math.cos(a) * 26;
        const y2 = 200 + Math.sin(a) * 26;
        return (
          <line
            key={`stamen-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="hsl(38 55% 38%)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x = 200 + Math.cos(a) * 28;
        const y = 200 + Math.sin(a) * 28;
        return <circle key={`tip-${i}`} cx={x} cy={y} r="2.8" fill="hsl(42 80% 72%)" />;
      })}
    </motion.svg>
  );
};

export default LotusFlower;
