const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, 'algiers-multi-tenant');
const srcAppDir = path.join(projectDir, 'src', 'app');

if (!fs.existsSync(srcAppDir)) {
  console.log("src/app not found");
  process.exit(1);
}

const dynamicRouteDir = path.join(srcAppDir, '[slug]');
if (!fs.existsSync(dynamicRouteDir)) {
  fs.mkdirSync(dynamicRouteDir, { recursive: true });
}

const pageTsxPath = path.join(dynamicRouteDir, 'page.tsx');
const pageTsxContent = `
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

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

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between"
         style={{ '--brand-primary': branding.color_palette[0], '--brand-secondary': branding.color_palette[1] } as any}>
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold text-[var(--brand-secondary)] mb-4">{restaurant.name}</h1>
        <p className="text-lg text-stone-300 mb-8">{JSON.parse(restaurant.cuisine).join(', ')}</p>
        
        <div className="w-full max-w-4xl">
          {restaurant.menuCategories.map((cat: any) => (
            <div key={cat.id} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 border-b border-stone-800 pb-2">{cat.name}</h2>
              <div className="space-y-4">
                {cat.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-4 bg-stone-900 rounded-lg">
                    <div>
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      <p className="text-sm text-stone-400">{item.description}</p>
                    </div>
                    <div className="text-[var(--brand-secondary)] font-bold">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
`;
fs.writeFileSync(pageTsxPath, pageTsxContent);
console.log("Created dynamic route.");
