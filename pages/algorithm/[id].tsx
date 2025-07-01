import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FiGitBranch, FiStar, FiGitCommit } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface Algorithm {
  _id: string;
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

export default function AlgorithmDetail() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlgorithm = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/algorithms/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch algorithm');
        }
        const data = await response.json();
        console.log('Fetched algorithm:', data);
        setAlgorithm(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Fetch error:', error);
          toast.error(error.message || 'Failed to fetch algorithm details');
        } else {
          console.error('Fetch error:', error);
          toast.error('Failed to fetch algorithm details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAlgorithm();
    }
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black text-white p-8 flex items-center justify-center">
      Loading...
    </div>;
  }

  if (!algorithm) {
    return <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black text-white p-8 flex items-center justify-center">
      Algorithm not found
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        

        <div className="bg-gray-800/50 backdrop-blur rounded-xl p-8 shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-bold">{algorithm.name}</h1>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-gray-400 hover:text-white">
                <FiStar /> {algorithm.stars}
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-8">
            <span className="flex items-center gap-1">
              <FiGitBranch /> Version {algorithm.version}
            </span>
            <span className="flex items-center gap-1">
              <FiGitCommit /> Updated: {algorithm.lastUpdated}
            </span>
            <span>By {algorithm.author}</span>
            <span>Language: {algorithm.language}</span>
            <span>Complexity: {algorithm.complexity}</span>
            <span>Qubits: {algorithm.numQubits}</span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-300">{algorithm.description}</p>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {algorithm.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quantum Operations */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Quantum Operations</h2>
            <div className="flex flex-wrap gap-2">
              {algorithm.operations.map((op) => (
                <span
                  key={op}
                  className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                >
                  {op}
                </span>
              ))}
            </div>
          </div>

          {/* Code */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Implementation</h2>
            <pre className="bg-gray-900 p-6 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono text-gray-300">
                {algorithm.code}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}