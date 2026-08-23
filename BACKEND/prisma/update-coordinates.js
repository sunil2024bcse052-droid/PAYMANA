const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// One-time script to backfill lat/long for projects that existed before
// the map feature was added. Matches by exact project name.
const coordinates = [
  { name: 'River Crossing Cable-Stayed Bridge', latitude: 25.5941, longitude: 85.1376 }, // Patna, Bihar
  { name: 'highway', latitude: 32.9269, longitude: 75.1352 },                             // Udhampur, J&K
  { name: 'Srinagar-Sonmarg Rail Link', latitude: 34.2276, longitude: 74.7736 },          // Ganderbal, J&K
  { name: 'City Metro Phase 2 Extension', latitude: 12.9716, longitude: 77.5946 },        // Bengaluru, Karnataka
  { name: 'mega hostel building', latitude: 34.0837, longitude: 74.7973 },                // Srinagar, J&K
  { name: 'cricket pitch', latitude: 34.0837, longitude: 74.7973 },                       // Srinagar, J&K
  { name: 'District Collectorate Building Complex', latitude: 9.9816, longitude: 76.2999 }, // Ernakulam, Kerala
  { name: 'indoor badminton court', latitude: 34.0837, longitude: 74.7973 },              // Srinagar, J&K
  { name: 'tunnel', latitude: 34.0837, longitude: 74.7973 },                              // Srinagar, J&K
];

async function main() {
  for (const item of coordinates) {
    const result = await prisma.project.updateMany({
      where: { name: item.name },
      data: { latitude: item.latitude, longitude: item.longitude },
    });
    console.log(`${item.name}: updated ${result.count} row(s)`);
  }
  console.log('Done updating coordinates.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  