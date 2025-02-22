import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  votes: { type: Number, default: 0 },
  comments: { type: Array, default: [] },
  timestamp: { type: String, default: new Date().toISOString() },
  tags: { type: [String], default: [] },
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post; 