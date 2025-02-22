import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../../lib/mongodb';
import Discussion from '../../../models/Discussion';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await dbConnect.connectToKnowledgeDb();

  switch (req.method) {
    case 'GET':
      try {
        const discussion = await Discussion.findById(id);
        if (!discussion) {
          return res.status(404).json({ error: 'Discussion not found' });
        }
        res.status(200).json(discussion);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch discussion' });
      }
      break;

    case 'PUT':
      try {
        const discussion = await Discussion.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!discussion) {
          return res.status(404).json({ error: 'Discussion not found' });
        }
        res.status(200).json(discussion);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update discussion' });
      }
      break;

    case 'DELETE':
      try {
        const discussion = await Discussion.findByIdAndDelete(id);
        if (!discussion) {
          return res.status(404).json({ error: 'Discussion not found' });
        }
        res.status(200).json({ message: 'Discussion deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete discussion' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
} 