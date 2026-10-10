
import React from 'react';
import { Utensils, Star, MapPin } from 'lucide-react';

export default function Hero({ restaurant, branding, cuisine }: { restaurant: any, branding: any, cuisine: string[] }) {
  return (
    <section 
      aria-label="Hero section"
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-stone-950 px-4 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--brand-primary)] via-stone-950 to-stone-950" />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center mt-16 sm:mt-0">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/80 border border-stone-800 text-stone-300 text-sm font-medium tracking-wide mb-8 backdrop-blur-sm shadow-sm ring-1 ring-[var(--brand-secondary)]/30">
          <Utensils className="w-4 h-4 text-[var(--brand-secondary)]" aria-hidden="true" />
          <span>{cuisine.join(' ? ')}</span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-lg leading-tight">
          {restaurant.name}
        </h1>

        <div className="flex flex-wrap justify-center gap-2 mb-10" aria-label="Restaurant aesthetics">
          {branding.aesthetic_keywords.map((tag: string, idx: number) => (
            <span 
              key={idx} 
              className="px-3 py-1 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-secondary)] text-xs sm:text-sm border border-[var(--brand-secondary)]/20 uppercase tracking-wider font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
          <a
            href="#menu"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--brand-secondary)] text-stone-950 font-bold text-sm sm:text-base tracking-wide hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 transition-all shadow-lg"
          >
            Explorer la Carte
          </a>
          <div className="flex items-center gap-2 text-stone-400 text-sm font-medium">
            <MapPin className="w-4 h-4 text-[var(--brand-secondary)]" aria-hidden="true" />
            <span>{restaurant.address}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
