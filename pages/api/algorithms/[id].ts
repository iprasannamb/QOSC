import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Algorithm from '../../../models/Algorithm';
import { Document } from 'mongoose';

interface AlgorithmDocument {
  _id: any;
  name: string;
  description: string;
  version: string;
  author: string;
  stars: number;
  lastUpdated: string;
  language: string;
  complexity: string;
  tags: string[];
  operations: string[];
  numQubits: number;
  code: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const { id } = req.query;
    
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    switch (req.method) {
      case 'GET':
        try {
          console.log('Searching for algorithm with ID:', id);
          const algorithm = await Algorithm.findById(id).lean() as unknown as AlgorithmDocument;
          
          if (!algorithm) {
            console.log('Algorithm not found');
            return res.status(404).json({ error: 'Algorithm not found' });
          }
          
          console.log('Found algorithm:', algorithm);
          return res.status(200).json({
            ...algorithm,
            _id: algorithm._id.toString()
          });
        } catch (error: any) {
          console.error('API error:', error);
          res.status(500).json({ error: error.message || 'Failed to fetch algorithm' });
        }
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: error.message || 'Database connection failed' });
  }
} 