import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  votes: {
    type: Number,
    default: 0
  },
  isUpvoted: {
    type: Boolean,
    default: false
  },
  isDownvoted: {
    type: Boolean,
    default: false
  }
});

const DiscussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    name: {
      type: String,
      required: true
    }
  },
  votes: {
    type: Number,
    default: 0
  },
  comments: [CommentSchema],
  timestamp: {
    type: Date,
    default: Date.now
  },
  tags: [String],
  isUpvoted: {
    type: Boolean,
    default: false
  },
  isDownvoted: {
    type: Boolean,
    default: false
  }
});

export default mongoose.models.Discussion || mongoose.model('Discussion', DiscussionSchema); 