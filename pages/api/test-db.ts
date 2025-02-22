import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToKnowledgeDb } from '../../lib/mongodb';
import Discussion from '../../models/Discussion';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToKnowledgeDb();
    const discussions = await Discussion.find({});
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to database' });
  }
} 