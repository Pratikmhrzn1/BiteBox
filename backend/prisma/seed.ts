import 'dotenv/config';
import { Prisma, PrismaClient, ReviewStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DEFAULT_SITE_CONTENT } from '../src/common/site-content';

const prisma = new PrismaClient();

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=60`;

const CHEESE = { id: 'extra-cheese', label: 'Extra Cheese', price: 40 };
const SPICY = { id: 'spicy-sauce', label: 'Spicy Sauce', price: 20 };
const PATTY = { id: 'double-patty', label: 'Double Patty', price: 80 };
const BACON = { id: 'smoked-bacon', label: 'Smoked Bacon', price: 90 };

const CATEGORIES = [
  { name: 'Burgers', slug: 'burgers', sortOrder: 0 },
  { name: 'Tacos', slug: 'tacos', sortOrder: 1 },
  { name: 'Sides', slug: 'sides', sortOrder: 2 },
  { name: 'Drinks', slug: 'drinks', sortOrder: 3 },
];

const MENU = [
  {
    slug: 'smashed-chicken-burger',
    name: 'Smashed Chicken Burger',
    price: 290,
    description: 'Crispy smashed chicken patty with tangy slaw and house sauce.',
    image: unsplash('photo-1568901346375-23c9450c58cd'),
    category: 'burgers',
    bestSeller: true,
    extras: [CHEESE, SPICY, BACON],
    sizes: [
      { id: 'classic', label: 'Classic', price: 290 },
      { id: 'double', label: 'Double', price: 430 },
    ],
    sortOrder: 0,
  },
  {
    slug: 'double-smashed-burger',
    name: 'Double Smashed Burger',
    price: 390,
    description: 'Two juicy smashed patties, double cheese and grilled onions.',
    image: unsplash('photo-1553979459-d2229ba7433b'),
    category: 'burgers',
    bestSeller: true,
    spicy: true,
    extras: [CHEESE, PATTY, BACON],
    sizes: [
      { id: 'classic', label: 'Classic', price: 390 },
      { id: 'triple', label: 'Triple', price: 550 },
    ],
    sortOrder: 1,
  },
  {
    slug: 'veg-smash-burger',
    name: 'Veg Smash Burger',
    price: 220,
    description: 'Crunchy veg patty with lettuce, tomato and smoky aioli.',
    image: unsplash('photo-1571091718767-18b5b1457add'),
    category: 'burgers',
    vegetarian: true,
    extras: [CHEESE, SPICY],
    sizes: [
      { id: 'classic', label: 'Classic', price: 220 },
      { id: 'double', label: 'Double', price: 330 },
    ],
    sortOrder: 2,
  },
  {
    slug: 'smashed-taco',
    name: 'Smashed Taco',
    price: 190,
    description: 'Smash-grilled filling in warm tortillas with pico de gallo.',
    image: unsplash('photo-1565299585323-38d6b0865b47'),
    category: 'tacos',
    extras: [CHEESE, SPICY],
    sortOrder: 3,
  },
  {
    slug: 'crispy-chicken-taco',
    name: 'Crispy Chicken Taco',
    price: 210,
    description: 'Golden-fried chicken, creamy slaw and lime crema.',
    image: unsplash('photo-1599974579688-8dbdd335c77f'),
    category: 'tacos',
    spicy: true,
    extras: [SPICY, CHEESE],
    sortOrder: 4,
  },
  {
    slug: 'loaded-nachos',
    name: 'Supreme Loaded Nachos',
    price: 180,
    description: 'Tortilla chips piled high with cheese, beans and jalapeños.',
    image: unsplash('photo-1513456852971-30c0b8199d4d'),
    category: 'sides',
    spicy: true,
    vegetarian: true,
    extras: [CHEESE],
    sortOrder: 5,
  },
  {
    slug: 'classic-fries',
    name: 'Classic Fries',
    price: 120,
    description: 'Crispy golden fries with a dusting of special seasoning.',
    image: unsplash('photo-1573080496219-bb080dd4f877'),
    category: 'sides',
    vegetarian: true,
    sizes: [
      { id: 'regular', label: 'Regular', price: 120 },
      { id: 'large', label: 'Large', price: 180 },
    ],
    sortOrder: 6,
  },
  {
    slug: 'mango-lassi',
    name: 'Mango Lassi',
    price: 130,
    description: 'Thick, sweet mango yogurt shake — cool and refreshing.',
    image: unsplash('photo-1544145945-f90425340c7e'),
    category: 'drinks',
    vegetarian: true,
    sortOrder: 7,
  },
  {
    slug: 'berry-mint-cooler',
    name: 'Berry Mint Cooler',
    price: 150,
    description: 'Mixed berries muddled with fresh mint over crushed ice.',
    image: unsplash('photo-1497534446932-c925b458314e'),
    category: 'drinks',
    vegetarian: true,
    sortOrder: 8,
  },
];

const REVIEWS = [
  {
    author: 'Sita Gurung',
    slug: 'smashed-chicken-burger',
    rating: 5,
    title: 'Best smash in Lalitpur',
    body: 'Juicy, crispy and the house sauce is unreal. Ordered three times this week.',
    status: ReviewStatus.APPROVED,
  },
  {
    author: 'Ramesh Shrestha',
    slug: 'double-smashed-burger',
    rating: 5,
    title: 'Patty perfection',
    body: 'Right level of smash, great cheese pull. My new weekend ritual.',
    status: ReviewStatus.APPROVED,
  }
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@bitebox.com.np';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

  // Wipe the transactional tables so re-seeding is idempotent. Users are
  // upserted instead, so re-running never invalidates a login you are using.
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  // ── Users ───────────────────────────────────────────────────────────────
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN', passwordHash: adminPasswordHash },
    create: {
      name: 'BiteBox Admin',
      email: adminEmail,
      phone: '+977 9800000001',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  // ── Categories and menu ─────────────────────────────────────────────────
  const categoryIds = new Map<string, string>();
  for (const category of CATEGORIES) {
    const row = await prisma.category.create({ data: category });
    categoryIds.set(category.slug, row.id);
  }

  const menuIds = new Map<string, { id: string; price: number }>();
  for (const item of MENU) {
    const row = await prisma.menuItem.create({
      data: {
        slug: item.slug,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        categoryId: categoryIds.get(item.category)!,
        bestSeller: item.bestSeller ?? false,
        spicy: item.spicy ?? false,
        vegetarian: item.vegetarian ?? false,
        sizes: (item.sizes ?? []) as unknown as Prisma.InputJsonValue,
        extras: (item.extras ?? []) as unknown as Prisma.InputJsonValue,
        sortOrder: item.sortOrder,
      },
    });
    menuIds.set(item.slug, { id: row.id, price: row.price });
  }

  // ── Reviews ─────────────────────────────────────────────────────────────
  for (const review of REVIEWS) {
    await prisma.review.create({
      data: {
        menuItemId: menuIds.get(review.slug)!.id,
        authorName: review.author,
        rating: review.rating,
        title: review.title,
        body: review.body,
        status: review.status,
      },
    });
  }

  // ── Contact messages ────────────────────────────────────────────────────
  await prisma.contactMessage.createMany({
    data: [
      {
        name: 'Nabin Thapa',
        email: 'nabin@example.com',
        phone: '+977 9841001122',
        subject: 'Catering',
        message: 'Do you cater office lunches for 30 people in Lalitpur?',
      }
    ],
  });

  // ── Editable site copy ──────────────────────────────────────────────────
  await prisma.siteContent.upsert({
    where: { id: 'singleton' },
    update: { data: DEFAULT_SITE_CONTENT as unknown as Prisma.InputJsonValue },
    create: {
      id: 'singleton',
      data: DEFAULT_SITE_CONTENT as unknown as Prisma.InputJsonValue,
    },
  });

  console.log('🌱 Seeded BiteBox');
  console.log(`   ${MENU.length} dishes across ${CATEGORIES.length} categories`);
  console.log(`   ${REVIEWS.length} reviews`);
  console.log(`   Admin    → ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
