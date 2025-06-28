import { Algorithm, Author } from '@/types/repository';

// Sample author data
const sampleAuthors: Author[] = [
  {
    id: 'user1',
    name: 'quantum_dev',
    avatar: '/images/default-avatar.png',
    role: 'researcher'
  },
  {
    id: 'user2',
    name: 'alice_quantum',
    avatar: '/images/default-avatar.png',
    role: 'developer'
  },
  {
    id: 'user3',
    name: 'bob_researcher',
    avatar: '/images/default-avatar.png',
    role: 'professor'
  }
];

// Sample algorithms data
export const sampleAlgorithms: Algorithm[] = [
  {
    _id: '1',
    name: 'Quantum Fourier Transform',
    description: 'Efficient implementation of the quantum Fourier transform with optimized gate sequences.',
    version: '2.1.0',
    author: sampleAuthors[0],
    stars: 245,
    userHasStarred: false,
    lastUpdated: '2024-03-15',
    language: 'Qiskit',
    complexity: 'O(n log n)',
    tags: ['transformation', 'fundamental', 'optimization'],
    comments: [],
    collaborators: [],
    forks: 78
  },
  {
    _id: '2',
    name: "Grover's Search Algorithm",
    description: 'Quantum algorithm for unstructured search with quadratic speedup over classical algorithms.',
    version: '1.3.2',
    author: sampleAuthors[1],
    stars: 189,
    userHasStarred: false,
    lastUpdated: '2024-03-10',
    language: 'Q#',
    complexity: 'O(√N)',
    tags: ['search', 'optimization', 'oracle'],
    comments: [],
    collaborators: [],
    forks: 45
  },
  {
    _id: '3',
    name: 'QAOA for MaxCut',
    description: 'Quantum Approximate Optimization Algorithm implementation for the MaxCut problem.',
    version: '1.0.1',
    author: sampleAuthors[2],
    stars: 156,
    userHasStarred: true,
    lastUpdated: '2024-03-08',
    language: 'Cirq',
    complexity: 'Variable',
    tags: ['optimization', 'NISQ', 'graph-theory'],
    comments: [],
    collaborators: [],
    forks: 32
  },
  {
    _id: '4',
    name: 'Quantum Phase Estimation',
    description: 'Implementation of QPE for eigenvalue estimation with high precision.',
    version: '1.2.0',
    author: sampleAuthors[0],
    stars: 132,
    userHasStarred: false,
    lastUpdated: '2024-02-25',
    language: 'Qiskit',
    complexity: 'O(n²)',
    tags: ['estimation', 'fundamental', 'simulation'],
    comments: [],
    collaborators: [],
    forks: 28
  },
  {
    _id: '5',
    name: 'Variational Quantum Eigensolver',
    description: 'NISQ-friendly algorithm for finding ground state energies of molecules.',
    version: '2.0.1',
    author: sampleAuthors[1],
    stars: 201,
    userHasStarred: true,
    lastUpdated: '2024-03-01',
    language: 'PyQuil',
    complexity: 'Variable',
    tags: ['chemistry', 'NISQ', 'optimization'],
    comments: [],
    collaborators: [],
    forks: 53
  }
];