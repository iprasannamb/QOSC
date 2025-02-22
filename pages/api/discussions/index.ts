import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToKnowledgeDb } from '../../../lib/mongodb';
import Discussion from '../../../models/Discussion';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToKnowledgeDb();

  switch (req.method) {
    case 'GET':
      try {
        const discussions = await Discussion.find({}).sort({ timestamp: -1 });
        res.status(200).json(discussions);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch discussions' });
      }
      break;

    case 'POST':
      try {
        const discussion = await Discussion.create(req.body);
        res.status(201).json(discussion);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create discussion' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
} 