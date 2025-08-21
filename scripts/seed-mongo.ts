import { connect, connection, Schema, model } from 'mongoose';

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/expanders360';
  await connect(uri);
  const ResearchSchema = new Schema({
    projectId: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
  }, { timestamps: true });

  const Research = model('ResearchDocument', ResearchSchema);

  await Research.create([
    { projectId: 1, title: 'UAE Market Report', content: 'Trends, regulations, and opportunities.', tags: ['uae', 'market', 'regulations'] },
    { projectId: 1, title: 'Payroll Providers Overview', content: 'List of payroll vendors and SLAs.', tags: ['payroll', 'vendors'] },
  ]);

  console.log('Seeded Mongo with research documents.');
  await connection.close();
}

run().catch(e => { console.error(e); process.exit(1); });
