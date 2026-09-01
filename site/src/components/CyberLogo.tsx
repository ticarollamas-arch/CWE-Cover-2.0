import React from 'react';

interface CyberLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  className?: string;
  animate?: boolean;
}

export default function CyberLogo({
  size = 'md',
  showText = true,
  subtitle = 'by CyberHuntLab • Carol Lamas',
  className = '',
  animate = true,
}: CyberLogoProps) {
  const sizeMap = {
    xs: { icon: 24, text: 'text-sm', sub: 'text-[9px]', badge: 'h-6 w-6' },
    sm: { icon: 32, text: 'text-base', sub: 'text-[10px]', badge: 'h-8 w-8' },
    md: { icon: 40, text: 'text-lg', sub: 'text-xs', badge: 'h-10 w-10' },
    lg: { icon: 52, text: 'text-2xl', sub: 'text-xs', badge: 'h-13 w-13' },
    xl: { icon: 68, text: 'text-3xl', sub: 'text-sm', badge: 'h-17 w-17' },
  };

  const { icon, text, sub, badge } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Modern Cyber Vector Logo Icon */}
      <div
        className={`relative ${badge} shrink-0 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-[1.5px] shadow-lg shadow-emerald-500/20 group`}
      >
        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle Cyber Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:6px_6px] opacity-25" />

          {/* Dynamic SVG Hologram Crest */}
          <svg
            width={icon * 0.65}
            height={icon * 0.65}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            {/* Outer Hexagon Target Frame */}
            <path
              d="M16 2L28 8.9282V23.0718L16 30L4 23.0718V8.9282L16 2Z"
              stroke="url(#cyber-grad-1)"
              strokeWidth="1.75"
              strokeLinejoin="round"
              className={animate ? 'opacity-90' : 'opacity-80'}
            />

            {/* Inner Shield / Radar Aperture */}
            <path
              d="M16 6L24 10.5V19.5C24 23.5 16 26.5 16 26.5C16 26.5 8 23.5 8 19.5V10.5L16 6Z"
              fill="url(#cyber-grad-2)"
              fillOpacity="0.2"
              stroke="url(#cyber-grad-3)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Center Recon Eye / Target Reticle */}
            <circle cx="16" cy="16" r="3.5" fill="#10b981" fillOpacity="0.9" />
            <circle cx="16" cy="16" r="5.5" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" className={animate ? 'animate-spin origin-center' : ''} style={{ animationDuration: '8s' }} />

            {/* Crosshair Target Pointers */}
            <line x1="16" y1="7.5" x2="16" y2="10" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="16" y1="22" x2="16" y2="24.5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="9.5" y1="16" x2="12" y2="16" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="16" x2="22.5" y2="16" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

            <defs>
              <linearGradient id="cyber-grad-1" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34d399" />
                <stop offset="0.5" stopColor="#2dd4bf" />
                <stop offset="1" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="cyber-grad-2" x1="8" y1="6" x2="24" y2="26.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10b981" />
                <stop offset="1" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="cyber-grad-3" x1="8" y1="6" x2="24" y2="26.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6ee7b7" />
                <stop offset="1" stopColor="#7dd3fc" />
              </linearGradient>
            </defs>
          </svg>

          {/* Laser Scanner Line */}
          {animate && (
            <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-70" style={{ top: '48%' }} />
          )}
        </div>
      </div>

      {/* Typography & Brand Mark */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-mono font-bold tracking-tight text-slate-100 ${text}`}>
              cwe<span className="text-emerald-400">-</span>discover
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              v1.0
            </span>
          </div>
          {subtitle && (
            <span className={`font-mono text-cyan-400/90 tracking-wide mt-0.5 ${sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
