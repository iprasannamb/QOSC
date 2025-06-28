// Define types for the repository page

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  contributionHistory?: {
    date: string;
    type: 'commit' | 'star' | 'fork' | 'comment' | 'upload';
    description: string;
  }[];
}

export interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: string;
  likes: number;
  userHasLiked: boolean;
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: string;
  permissions: 'read' | 'write' | 'admin';
  joinedAt: string; // ISO date string
  contributionCount?: number;
}


export interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Algorithm {
  _id: string;
  name: string;
  description: string;
  version: string;
  author: Author | string; // Allow both object and string for backward compatibility
  stars: number;
  userHasStarred?: boolean;
  lastUpdated: string;
  language: string;
  complexity: string;
  tags: string[];
  comments?: Comment[] | string[]; // Array of Comment objects or strings
  collaborators: User[]; // Array of User objects
  forks?: number;
}

export type SortField = 'name' | 'stars' | 'lastUpdated' | 'complexity';
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  direction: SortDirection;
  label: string;
}

