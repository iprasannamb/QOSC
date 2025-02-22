import mongoose from 'mongoose';

const AlgorithmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  version: { type: String, required: true },
  author: { type: String, required: true },
  stars: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  language: { type: String, required: true },
  complexity: { type: String, required: true },
  tags: [{ type: String }],
  operations: [{ type: String }],
  numQubits: { type: Number, required: true },
  code: { type: String, required: true }
});

export default mongoose.models.Algorithm || mongoose.model('Algorithm', AlgorithmSchema); 