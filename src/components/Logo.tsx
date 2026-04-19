interface Props {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
}

export default function Logo({ size = 'md', variant = 'full', className = '' }: Props) {
  const heights = { sm: 28, md: 36, lg: 52 };
  const h = heights[size];

  // Always use the uploaded logo image — it contains both icon + wordmark
  return (
    <div className={`flex items-center flex-shrink-0 ${className}`}>
      <img
        src="/logo.png"
        alt="NextForge Academy"
        style={{ height: h, width: 'auto', objectFit: 'contain', display: 'block' }}
        onError={(e) => {
          // Fallback: render SVG wordmark if image fails
          const el = e.currentTarget;
          el.style.display = 'none';
          const fb = el.nextElementSibling as HTMLElement | null;
          if (fb) fb.style.display = 'flex';
        }}
      />
      {/* Fallback wordmark — hidden unless image fails */}
      <div className="items-center gap-2" style={{ display: 'none' }}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width={h} height={h}>
          <rect width="40" height="40" rx="10" fill="#112b58"/>
          <path d="M20 8L6 15.5l14 7 14-7-14-7z" fill="#ee7a3d"/>
          <path d="M11 19.5v6s3.5 3.5 9 3.5 9-3.5 9-3.5v-6l-9 4.5-9-4.5z" fill="#ee7a3d" opacity="0.85"/>
        </svg>
        {variant !== 'icon' && (
          <div>
            <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: size === 'lg' ? 20 : size === 'md' ? 16 : 13, color: '#f0f4ff', letterSpacing: '-0.02em' }}>
              Next<span style={{ color: '#ee7a3d' }}>Forge</span>
            </span>
            {size !== 'sm' && (
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 600, color: '#5a7099', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: -2 }}>
                Academy
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
