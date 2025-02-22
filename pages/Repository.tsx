import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiGitBranch, FiUpload, FiDownload, FiStar, FiGitCommit } from 'react-icons/fi';
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
}

export default function Repository() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [circuitName, setCircuitName] = useState('');
  const [circuitDescription, setCircuitDescription] = useState('');
  const [operations, setOperations] = useState([]);
  const [numQubits, setNumQubits] = useState(1);
  const [currentUser, setCurrentUser] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('Qiskit');
  const [complexity, setComplexity] = useState('O(n)');
  const [selectedOperations, setSelectedOperations] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [qasmFile, setQasmFile] = useState<File | null>(null);

  const QUANTUM_LANGUAGES = ['Qiskit', 'Cirq', 'Q#', 'Pennylane', 'Braket'];
  const COMPLEXITY_OPTIONS = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'];
  const QUANTUM_OPERATIONS = ['h', 'x', 'y', 'z', 'cx', 'cz', 'swap', 'toffoli', 'rx', 'ry', 'rz'];

  useEffect(() => {
    fetchAlgorithms();
  }, []);

  const fetchAlgorithms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/algorithms');
      const data = await response.json();
      setAlgorithms(data);
    } catch (error) {
      toast.error('Failed to fetch algorithms');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAlgorithm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOperations.length) {
      toast.error('Please select at least one quantum operation');
      return;
    }

    try {
      let qasmCode = code;
      if (qasmFile) {
        // Read the QASM file content
        const fileContent = await qasmFile.text();
        qasmCode = fileContent;
      }

      const formData = {
        name: circuitName,
        description: circuitDescription,
        version: '1.0.0',
        author: currentUser || 'Anonymous',
        stars: 0,
        lastUpdated: new Date().toISOString(),
        language: selectedLanguage,
        complexity: complexity,
        tags: selectedTags,
        operations: selectedOperations,
        numQubits: numQubits,
        code: qasmCode
      };

      const response = await fetch('/api/algorithms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload');
      }

      toast.success('Algorithm uploaded successfully');
      await fetchAlgorithms();
      setIsUploadModalOpen(false);

      // Reset form
      setCircuitName('');
      setCircuitDescription('');
      setSelectedLanguage('Qiskit');
      setComplexity('O(n)');
      setOperations([]);
      setSelectedOperations([]);
      setNumQubits(1);
      setSelectedTags([]);
      setCode('');
      setQasmFile(null);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload algorithm');
    }
  };

  const filteredAlgorithms = algorithms.filter((algo) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      algo.name.toLowerCase().includes(searchLower) ||
      algo.description.toLowerCase().includes(searchLower) ||
      algo.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black text-white p-8">
      {/* Remove the header section entirely and start with the upload button */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-end">
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiUpload /> Upload Algorithm
        </button>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/95 backdrop-blur rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold flex items-center">
                  <FiUpload className="mr-2" /> Upload Quantum Algorithm
                </h2>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={uploadAlgorithm} className="space-y-6">
                {/* Basic Info Section */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Algorithm Name *"
                    className="bg-gray-700 rounded-lg px-4 py-2"
                    value={circuitName}
                    onChange={(e) => setCircuitName(e.target.value)}
                    required
                  />
                  <select
                    className="bg-gray-700 rounded-lg px-4 py-2"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    required
                  >
                    <option value="">Select Language *</option>
                    {QUANTUM_LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <textarea
                  placeholder="Algorithm Description *"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 h-32"
                  value={circuitDescription}
                  onChange={(e) => setCircuitDescription(e.target.value)}
                  required
                />

                {/* Technical Details */}
                <div className="grid grid-cols-2 gap-4">
                  <select
                    className="bg-gray-700 rounded-lg px-4 py-2"
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    required
                  >
                    <option value="">Select Complexity *</option>
                    {COMPLEXITY_OPTIONS.map(comp => (
                      <option key={comp} value={comp}>{comp}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Number of Qubits *"
                    className="bg-gray-700 rounded-lg px-4 py-2"
                    value={numQubits}
                    onChange={(e) => setNumQubits(parseInt(e.target.value))}
                    min="1"
                    required
                  />
                </div>

                Quantum Operations
                <div className="space-y-2">
                  <label className="block text-sm text-gray-300">Quantum Operations *</label>
                  <div className="flex flex-wrap gap-2">
                    {QUANTUM_OPERATIONS.map(op => (
                      <button
                        key={op}
                        type="button"
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedOperations.includes(op)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedOperations(prev =>
                            prev.includes(op)
                              ? prev.filter(item => item !== op)
                              : [...prev, op]
                          );
                        }}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <input
                    type="text"
                    placeholder="Tags (comma-separated) *"
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                    value={selectedTags.join(', ')}
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                      setSelectedTags(tags);
                    }}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Example: optimization, machine-learning, simulation</p>
                </div>

                {/* Add this before the Code Input section */}
                <div className="space-y-2">
                  <label className="block text-sm text-gray-300">Upload QASM File (Optional)</label>
                  <input
                    type="file"
                    accept=".qasm"
                    onChange={(e) => setQasmFile(e.target.files?.[0] || null)}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 text-sm"
                  />
                  <p className="text-xs text-gray-400">Upload a .qasm file or paste your code below</p>
                </div>

                {/* Code Input */}
              

                {/* Update submit button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="w-1/2 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                  >
                    <FiUpload /> Upload Algorithm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search algorithms..."
            className="flex-1 bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All Algorithms</option>
            <option value="optimization">Optimization</option>
            <option value="simulation">Simulation</option>
            <option value="ml">Machine Learning</option>
          </select>
        </div>
      </div>

      {/* Algorithm List Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Available Algorithms</h2>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="space-y-4">
            {filteredAlgorithms.map((algo) => (
              <AlgorithmItem key={algo._id} algorithm={algo} />
            ))}
          </div>
        )}
      </div>

      {/* Back to Home Button */}
      <div className="mt-12 text-center">
        <Link href="/">
          <span className="text-blue-400 hover:underline inline-flex items-center">
            ← Back to Home
          </span>
        </Link>
      </div>
    </div>
  );
}

function AlgorithmItem({ algorithm }: { algorithm: Algorithm }) {
  // Function to truncate description
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl shadow-xl hover:shadow-2xl transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{algorithm.name}</h3>
          <p className="text-gray-400 mb-3">
            {truncateDescription(algorithm.description)}
          </p>
          <div className="flex gap-2 flex-wrap">
            {algorithm.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-gray-400 hover:text-white">
            <FiStar /> {algorithm.stars}
          </button>
          <Link href={`/algorithm/${algorithm._id}`} className="inline-block">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
              View
            </button>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-400">
        <span className="flex items-center gap-1">
          <FiGitBranch /> Version {algorithm.version}
        </span>
        <span className="flex items-center gap-1">
          <FiGitCommit /> Last updated: {algorithm.lastUpdated}
        </span>
        <span>By {algorithm.author}</span>
        <span>Complexity: {algorithm.complexity}</span>
      </div>
    </div>
  );
}

const sampleAlgorithms: Algorithm[] = [
  {
    _id: '1',
    name: 'Quantum Fourier Transform',
    description: 'Efficient implementation of the quantum Fourier transform with optimized gate sequences.',
    version: '2.1.0',
    author: 'quantum_dev',
    stars: 245,
    lastUpdated: '2024-03-15',
    language: 'Qiskit',
    complexity: 'O(n log n)',
    tags: ['transformation', 'fundamental', 'optimization']
  },
  {
    _id: '2',
    name: "Grover's Search Algorithm",
    description: 'Quantum algorithm for unstructured search with quadratic speedup over classical algorithms.',
    version: '1.3.2',
    author: 'alice_quantum',
    stars: 189,
    lastUpdated: '2024-03-10',
    language: 'Q#',
    complexity: 'O(√N)',
    tags: ['search', 'optimization', 'oracle']
  },
  {
    _id: '3',
    name: 'QAOA for MaxCut',
    description: 'Quantum Approximate Optimization Algorithm implementation for the MaxCut problem.',
    version: '1.0.1',
    author: 'bob_researcher',
    stars: 156,
    lastUpdated: '2024-03-08',
    language: 'Cirq',
    complexity: 'Variable',
    tags: ['optimization', 'NISQ', 'graph-theory']
  }
];
