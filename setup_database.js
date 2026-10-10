const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, 'algiers-multi-tenant');

if (!fs.existsSync(projectDir)) {
  console.log("Waiting for Next.js app to be fully created...");
  process.exit(1);
}

try {
  console.log("Creating prisma directory...");
  const prismaDir = path.join(projectDir, 'prisma');
  if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true });
  }

  console.log("Writing Prisma Schema...");
  const schemaPath = path.join(prismaDir, 'schema.prisma');
  const schemaContent = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Restaurant {
  id              String      @id
  name            String
  cuisine         String      // Stored as JSON string
  address         String
  phone           String
  hours           String      // Stored as JSON string
  socialLinks     String      // Stored as JSON string
  branding        String      // Stored as JSON string
  menuCategories  MenuCategory[]
}

model MenuCategory {
  id           String      @id @default(cuid())
  restaurantId String
  name         String
  restaurant   Restaurant  @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  items        MenuItem[]
}

model MenuItem {
  id             String       @id @default(cuid())
  categoryId     String
  name           String
  description    String
  price          String
  category       MenuCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
}
`;
  fs.writeFileSync(schemaPath, schemaContent);

  console.log("Pushing DB schema...");
  execSync('npx prisma db push', { cwd: projectDir, stdio: 'inherit' });
  
  console.log("Generating Prisma client...");
  execSync('npx prisma generate', { cwd: projectDir, stdio: 'inherit' });

  console.log("Writing Seed Script...");
  const seedPath = path.join(prismaDir, 'seed.js');
  const seedContent = `
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
`;
  fs.writeFileSync(seedPath, seedContent);

  console.log("Running Seed...");
  execSync('node prisma/seed.js', { cwd: projectDir, stdio: 'inherit' });

  console.log("Database Setup Complete!");

} catch(e) {
  console.error("Error setting up DB:", e);
}
