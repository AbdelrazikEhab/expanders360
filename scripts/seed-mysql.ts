import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../src/modules/auth/user.entity';
import { Client } from '../src/modules/clients/client.entity';
import { Project } from '../src/modules/projects/project.entity';
import { Vendor } from '../src/modules/vendors/vendor.entity';
import * as bcrypt from 'bcrypt';

const ds = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: +(process.env.MYSQL_PORT || 3306),
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '', // Add password if needed
  database: process.env.MYSQL_DB || 'expanders360',
  entities: [User, Client, Project, Vendor],
  synchronize: false,
});

async function run() {
  await ds.initialize();
  const userRepo = ds.getRepository(User);
  const clientRepo = ds.getRepository(Client);
  const projectRepo = ds.getRepository(Project);
  const vendorRepo = ds.getRepository(Vendor);

  // Admin user
  const adminEmail = 'admin@expanders360.com';
  let admin = await userRepo.findOne({ where: { email: adminEmail } });
  if (!admin) {
    admin = userRepo.create({
      email: adminEmail,
      passwordHash: await bcrypt.hash('Admin123!', 10),
      role: 'admin',
    });
    await userRepo.save(admin);
  }

  // Client
  const clientCompany = 'Acme Ventures';
const client = await clientRepo.save(clientRepo.create({
  company_name: 'Acme Ventures',
  contact_email: 'client@acme.com',
}));
console.log('Saved client:', client);


  // Client user
  const clientEmail = 'client@acme.com';
  let clientUser = await userRepo.findOne({ where: { email: clientEmail } });
  if (!clientUser) {
    clientUser = userRepo.create({
      email: clientEmail,
      passwordHash: await bcrypt.hash('Client123!', 10),
      role: 'client',
      client,
    });
    await userRepo.save(clientUser);
  }

  // Project
  const projectName = 'UAE Project';
  let project = await projectRepo.findOne({
    where: { client, country: 'UAE' },
  });
  if (!project) {
    project = projectRepo.create({
      client,
      country: 'UAE',
      services_needed: ['legal', 'payroll', 'tax'],
      budget: 25000,
      status: 'active',
    });
    await projectRepo.save(project);
  }

  // Vendors
  const vendors = [
    {
      name: 'Gulf Legal Assoc.',
      countries_supported: ['UAE', 'KSA'],
      services_offered: ['legal', 'contracts'],
      rating: 4.6,
      response_sla_hours: 24,
    },
    {
      name: 'MENA Payroll Ltd',
      countries_supported: ['UAE', 'EGY'],
      services_offered: ['payroll', 'hr'],
      rating: 4.1,
      response_sla_hours: 48,
    },
    {
      name: 'Tax Pros ME',
      countries_supported: ['KSA', 'UAE', 'QAT'],
      services_offered: ['tax', 'accounting'],
      rating: 4.8,
      response_sla_hours: 12,
    },
  ];

  for (const v of vendors) {
    const exists = await vendorRepo.findOne({ where: { name: v.name } });
    if (!exists) {
      const vv = vendorRepo.create({
        ...v,
        sla_expires_at: new Date(Date.now() + 1000 * 60 * 60 * v.response_sla_hours),
        sla_expired: false,
      });
      await vendorRepo.save(vv);
    }
  }

  console.log('Seeded MySQL with admin, client, project, vendors.');
  await ds.destroy();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
