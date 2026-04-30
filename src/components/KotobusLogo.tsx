/**
 * Kotobus mascot logo — a more realistic Siamese courier cat.
 * Features classic point coloration, blue eyes, a soft cream coat,
 * and a small parcel to keep the delivery brand cue.
 *
 * Pure SVG. The `animated` prop adds a gentle bobbing motion.
 */
type Props = {
  className?: string;
  animated?: boolean;
  title?: string;
};

export default function KotobusLogo({
  className = "",
  animated = false,
  title = "Kotobus",
}: Props) {
  return (
    <svg
      viewBox="0 0 240 140"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={`${className} ${animated ? "kotobus-bob" : ""}`}
    >
      <title>{title}</title>

      <defs>
        <linearGradient id="busBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b6a58" />
          <stop offset="100%" stopColor="#64493b" />
        </linearGradient>
        <linearGradient id="busGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ecfeff" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="120" cy="126" rx="95" ry="10" fill="#2f221b" opacity="0.18" />

      {/* Regular bus */}
      <rect x="16" y="42" width="206" height="58" rx="14" fill="url(#busBody)" />
      <rect x="16" y="87" width="206" height="13" rx="6" fill="#4b362c" />

      {/* Windshield */}
      <rect x="24" y="50" width="44" height="28" rx="6" fill="url(#busGlass)" stroke="#2f221b" strokeWidth="2" />

      {/* Side windows */}
      <rect x="78" y="50" width="20" height="20" rx="4" fill="#e0f2fe" stroke="#2f221b" strokeWidth="1.6" />
      <rect x="104" y="50" width="20" height="20" rx="4" fill="#e0f2fe" stroke="#2f221b" strokeWidth="1.6" />
      <rect x="130" y="50" width="20" height="20" rx="4" fill="#e0f2fe" stroke="#2f221b" strokeWidth="1.6" />
      <rect x="156" y="50" width="20" height="20" rx="4" fill="#e0f2fe" stroke="#2f221b" strokeWidth="1.6" />

      {/* Door */}
      <rect x="184" y="52" width="28" height="40" rx="5" fill="#d6c2ad" stroke="#2f221b" strokeWidth="2" />
      <line x1="198" y1="52" x2="198" y2="92" stroke="#2f221b" strokeWidth="1.5" />

      {/* Siamese cat driver */}
      <g>
        {/* Ears */}
        <path d="M33 57 L29 45 L39 52 Z" fill="#3f2b22" />
        <path d="M33 57 L33 50 L37 53 Z" fill="#d6b3aa" />
        <path d="M54 57 L58 45 L48 52 Z" fill="#3f2b22" />
        <path d="M54 57 L54 50 L50 53 Z" fill="#d6b3aa" />

        {/* Head and mask */}
        <ellipse cx="44" cy="63" rx="14" ry="12" fill="#e8d8bf" />
        <ellipse cx="44" cy="63" rx="11" ry="10" fill="#5a4032" opacity="0.85" />
        <ellipse cx="44" cy="68" rx="7" ry="5" fill="#f6efe2" />

        {/* Blue eyes */}
        <ellipse cx="39" cy="62" rx="3.1" ry="2.4" fill="#eff6ff" />
        <ellipse cx="49" cy="62" rx="3.1" ry="2.4" fill="#eff6ff" />
        <ellipse cx="39" cy="62" rx="1.8" ry="1.9" fill="#2563eb" />
        <ellipse cx="49" cy="62" rx="1.8" ry="1.9" fill="#2563eb" />
        <ellipse cx="39" cy="62" rx="0.5" ry="1.8" fill="#0f172a" />
        <ellipse cx="49" cy="62" rx="0.5" ry="1.8" fill="#0f172a" />
        <circle cx="39.6" cy="61.2" r="0.4" fill="#ffffff" />
        <circle cx="49.6" cy="61.2" r="0.4" fill="#ffffff" />

        {/* Nose */}
        <path d="M42 67 Q44 69 46 67 Q44 70 42 67 Z" fill="#cfa699" stroke="#2f221b" strokeWidth="0.8" />
      </g>

      {/* Steering wheel in front of cat */}
      <circle cx="57" cy="74" r="5" fill="none" stroke="#2f221b" strokeWidth="2" />
      <line x1="57" y1="69" x2="57" y2="79" stroke="#2f221b" strokeWidth="1.5" />
      <line x1="52" y1="74" x2="62" y2="74" stroke="#2f221b" strokeWidth="1.5" />

      {/* Lights and bumper */}
      <circle cx="24" cy="96" r="4" fill="#dbeafe" />
      <circle cx="214" cy="96" r="4" fill="#dbeafe" />
      <rect x="14" y="98" width="210" height="5" rx="2.5" fill="#2f221b" opacity="0.55" />

      {/* Wheels */}
      <circle cx="62" cy="108" r="14" fill="#2f221b" />
      <circle cx="62" cy="108" r="6" fill="#d6c2ad" />
      <circle cx="176" cy="108" r="14" fill="#2f221b" />
      <circle cx="176" cy="108" r="6" fill="#d6c2ad" />
    </svg>
  );
}
