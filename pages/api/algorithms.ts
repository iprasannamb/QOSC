import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import Algorithm from '../../models/Algorithm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const algorithms = await Algorithm.find({}).sort({ lastUpdated: -1 });
        res.status(200).json(algorithms);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch algorithms' });
      }
      break;

    case 'POST':
      try {
        const algorithm = await Algorithm.create(req.body);
        res.status(201).json(algorithm);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
} 