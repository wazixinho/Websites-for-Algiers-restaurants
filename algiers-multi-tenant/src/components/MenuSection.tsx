
'use client';
import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function MenuSection({ categories }: { categories: any[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.name || '');
  const [searchQuery, setSearchQuery] = useState('');

  const currentCategoryObj = categories.find(c => c.name === activeCategory) || categories[0];
  
  const displayedItems = (currentCategoryObj ? currentCategoryObj.items : []).filter((item: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
  });

  return (
    <section id="menu" className="py-24 bg-stone-900 relative" aria-labelledby="menu-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 id="menu-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Notre Carte
          </h2>
          <p className="text-stone-400 text-base sm:text-lg">
            DAccouvrez notre sAclAcction de plats raffinAcs, prAcparAcs avec des ingrAcdients de premiA"re qualitAc.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Accessible Tablist */}
          <div 
            role="tablist" 
            aria-label="CatAcgories du menu"
            className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto focus:outline-none"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.name}
                aria-controls={`panel-${cat.id}`}
                id={`tab-${cat.id}`}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 ${
                  activeCategory === cat.name
                    ? 'bg-[var(--brand-secondary)] text-stone-950 shadow-md'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                }`}
              >
                <span>{cat.name}</span>
                <span 
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeCategory === cat.name ? 'bg-stone-900/10' : 'bg-stone-900 text-stone-400'
                  }`}
                >
                  {cat.items.length}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <label htmlFor="menu-search" className="sr-only">Rechercher un plat</label>
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              id="menu-search"
              type="search"
              placeholder="Rechercher un plat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-950/50 border border-stone-700/50 rounded-full pl-10 pr-4 py-2.5 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[var(--brand-secondary)] focus:ring-1 focus:ring-[var(--brand-secondary)] transition-all"
            />
          </div>
        </div>

        <div 
          id={`panel-${currentCategoryObj?.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${currentCategoryObj?.id}`}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {displayedItems.length > 0 ? (
            displayedItems.map((item: any) => (
              <article
                key={item.id}
                className="group p-6 rounded-2xl bg-stone-950/40 border border-stone-800 hover:border-[var(--brand-secondary)]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-[var(--brand-secondary)] transition-colors">
                      {item.name}
                    </h3>
                    <span className="shrink-0 font-mono text-[var(--brand-secondary)] font-bold">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-stone-400 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 text-center py-16 px-4 border-2 border-dashed border-stone-800 rounded-2xl">
              <p className="text-stone-400 text-lg">Aucun plat ne correspond A votre recherche <span className="font-semibold text-white">"{searchQuery}"</span>.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-[var(--brand-secondary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-secondary)]"
              >
                RCAcinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
