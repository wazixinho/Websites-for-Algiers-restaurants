
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, '..', '..', 'restaurants_data.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const restaurants = JSON.parse(rawData);

  console.log('Seeding ' + restaurants.length + ' restaurants...');

  for (const r of restaurants) {
    const restaurant = await prisma.restaurant.create({
      data: {
        id: r.id,
        name: r.name,
        cuisine: JSON.stringify(r.cuisine),
        address: r.address,
        phone: r.phone,
        hours: JSON.stringify(r.hours),
        socialLinks: JSON.stringify(r.social_links),
        branding: JSON.stringify(r.branding),
      }
    });

    for (const cat of r.menu) {
      const category = await prisma.menuCategory.create({
        data: {
          restaurantId: restaurant.id,
          name: cat.category,
        }
      });

      for (const item of cat.items) {
        await prisma.menuItem.create({
          data: {
            categoryId: category.id,
            name: item.name,
            description: item.description,
            price: item.price
          }
        });
      }
    }
    console.log('Seeded ' + r.name);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
