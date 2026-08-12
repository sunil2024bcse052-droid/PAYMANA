const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashed = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@paimana.dev' },
    update: {},
    create: { email: 'admin@paimana.dev', password: hashed, name: 'Admin User', role: 'ADMIN' },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'employee@paimana.dev' },
    update: {},
    create: { email: 'employee@paimana.dev', password: hashed, name: 'Priya Sharma', role: 'GOVT_EMPLOYEE' },
  });

  const contractor = await prisma.user.upsert({
    where: { email: 'contractor@paimana.dev' },
    update: {},
    create: { email: 'contractor@paimana.dev', password: hashed, name: 'L&T Construction Ltd', role: 'CONTRACTOR' },
  });

  const projects = [
    {
      name: 'Srinagar-Sonmarg Rail Link',
      category: 'RAIL',
      state: 'Jammu and Kashmir',
      district: 'Ganderbal',
      agency: 'Northern Railway',
      status: 'ONGOING',
      percentComplete: 62,
      startDate: new Date('2021-04-01'),
      plannedDeadline: new Date('2027-03-31'),
      sanctionedAmount: 4200000000,
      releasedAmount: 2600000000,
      utilizedAmount: 2100000000,
    },
    {
      name: 'City Metro Phase 2 Extension',
      category: 'METRO',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      agency: 'Bangalore Metro Rail Corporation',
      status: 'DELAYED',
      percentComplete: 78,
      startDate: new Date('2019-06-01'),
      plannedDeadline: new Date('2024-12-31'),
      revisedDeadline: new Date('2026-09-30'),
      sanctionedAmount: 12500000000,
      releasedAmount: 10000000000,
      utilizedAmount: 9700000000,
    },
    {
      name: 'District Collectorate Building Complex',
      category: 'BUILDING',
      state: 'Kerala',
      district: 'Ernakulam',
      agency: 'Public Works Department, Kerala',
      status: 'COMPLETED',
      percentComplete: 100,
      startDate: new Date('2020-01-15'),
      plannedDeadline: new Date('2022-12-31'),
      completedDate: new Date('2022-11-20'),
      sanctionedAmount: 850000000,
      releasedAmount: 850000000,
      utilizedAmount: 830000000,
    },
    {
      name: 'River Crossing Cable-Stayed Bridge',
      category: 'BRIDGE',
      state: 'Bihar',
      district: 'Patna',
      agency: 'National Highways Authority of India',
      status: 'PLANNED',
      percentComplete: 5,
      startDate: new Date('2026-01-01'),
      plannedDeadline: new Date('2029-12-31'),
      sanctionedAmount: 3100000000,
      releasedAmount: 150000000,
      utilizedAmount: 40000000,
    },
  ];

  for (const p of projects) {
    const created = await prisma.project.create({
      data: {
        name: p.name,
        category: p.category,
        state: p.state,
        district: p.district,
        agency: p.agency,
        status: p.status,
        percentComplete: p.percentComplete,
        startDate: p.startDate,
        plannedDeadline: p.plannedDeadline,
        revisedDeadline: p.revisedDeadline,
        completedDate: p.completedDate,
        registeredById: employee.id,
        contractorId: contractor.id,
        budget: {
          create: {
            sanctionedAmount: p.sanctionedAmount,
            releasedAmount: p.releasedAmount,
            utilizedAmount: p.utilizedAmount,
            fundingSource: 'central',
          },
        },
        sources: {
          create: [
            { title: 'Sample press release', url: 'https://pib.gov.in', type: 'press_release' },
          ],
        },
      },
    });

    await prisma.editLog.create({
      data: {
        projectId: created.id,
        userId: employee.id,
        action: 'created',
        diff: { name: p.name, sanctionedAmount: p.sanctionedAmount },
      },
    });
  }

  console.log('Seed complete.');
  console.log('Login with: admin@paimana.dev / employee@paimana.dev / contractor@paimana.dev');
  console.log('Password for all: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });