import mongoose from 'mongoose';

// Fix TypeScript global augmentation
declare global {
  var mongoose: {
    conn: any;
    promise: any;
    repoConn: any;
    knowledgeConn: any;
    repoPromise: any;
    knowledgePromise: any;
  } | undefined;
}

const REPO_DB_URI = process.env.REPO_DB_URI;
const KNOWLEDGE_DB_URI = process.env.KNOWLEDGE_DB_URI;

if (!REPO_DB_URI || !KNOWLEDGE_DB_URI) {
  throw new Error('Please define both REPO_DB_URI and KNOWLEDGE_DB_URI in .env.local');
}

let cached = global.mongoose || { 
  conn: null,
  promise: null,
  repoConn: null, 
  knowledgeConn: null, 
  repoPromise: null, 
  knowledgePromise: null 
};

export async function connectToRepoDb() {
  if (cached.repoConn) return cached.repoConn;

  if (!cached.repoPromise) {
    cached.repoPromise = mongoose.createConnection(REPO_DB_URI!, { useNewUrlParser: true, useUnifiedTopology: true }).asPromise();
  }
  cached.repoConn = await cached.repoPromise;
  return cached.repoConn;
}

export async function connectToKnowledgeDb() {
  if (cached.knowledgeConn) return cached.knowledgeConn;

  if (!cached.knowledgePromise) {
    cached.knowledgePromise = mongoose.createConnection(KNOWLEDGE_DB_URI!, { useNewUrlParser: true, useUnifiedTopology: true }).asPromise();
  }
  cached.knowledgeConn = await cached.knowledgePromise;
  return cached.knowledgeConn;
}

const MONGODB_URI = process.env.MONGODB_URI!;

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
}

export default dbConnect; 