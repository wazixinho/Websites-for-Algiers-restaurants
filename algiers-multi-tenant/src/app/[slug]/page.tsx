
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';
import MenuSection from '@/components/MenuSection';

const prisma = new PrismaClient();

export default async function RestaurantPage({ params }: { params: { slug: string } }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.slug },
    include: {
      menuCategories: {
        include: { items: true }
      }
    }
  });

  if (!restaurant) {
    notFound();
  }

  const branding = JSON.parse(restaurant.branding);
  const cuisine = JSON.parse(restaurant.cuisine);

  return (
    <div 
      className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-[var(--brand-secondary)] selection:text-black"
      style={{ 
        '--brand-primary': branding.color_palette[0], 
        '--brand-secondary': branding.color_palette[1],
        '--brand-accent': branding.color_palette[2]
      } as any}
    >
      <main className="flex-grow flex flex-col">
        <Hero restaurant={restaurant} branding={branding} cuisine={cuisine} />
        <MenuSection categories={restaurant.menuCategories} />
      </main>
      
      <footer className="bg-stone-950 py-12 border-t border-stone-900 text-center text-stone-500 text-sm">
        <p>A(c) {new Date().getFullYear()} {restaurant.name}. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-4">
          <span className="sr-only">RCAcseaux sociaux</span>
          {/* Mock Social Links */}
          <div className="w-8 h-8 rounded-full bg-stone-900 hover:bg-[var(--brand-secondary)] transition-colors cursor-pointer" aria-hidden="true" />
          <div className="w-8 h-8 rounded-full bg-stone-900 hover:bg-[var(--brand-secondary)] transition-colors cursor-pointer" aria-hidden="true" />
        </div>
      </footer>
    </div>
  );
}
