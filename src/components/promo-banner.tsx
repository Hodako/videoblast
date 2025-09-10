// src/components/promo-banner.tsx
'use client'

export default function PromoBanner({ settings }) {
  const banner = settings?.banner;

  if (!banner || !banner.enabled || !banner.text) {
    return null;
  }

  return (
    <div 
      className="px-5 py-2.5 text-center text-sm font-bold text-white"
      style={{ backgroundColor: banner.color || '#2ed573' }}
    >
      {banner.text}
    </div>
  );
}
