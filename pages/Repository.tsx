import React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import { FiUser, FiSettings, FiCreditCard, FiLogOut, FiUpload, FiChevronDown, FiFilter, FiGitBranch, FiGitCommit, FiStar, FiX } from 'react-icons/fi';
import { toast } from 'sonner';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';

// Types
interface Algorithm {
  _id: string;
  name: string;
  description: string;
  version: string;
  author: string | { id: string; name: string; avatar: string; role: string };
  stars: number;
  userHasStarred: boolean;
  lastUpdated: string;
  language: string;
  complexity: string;
  tags: string[];
  collaborators: any[];
  forks?: number;
  comments?: any[];
}

interface SortOption {
  field: keyof Algorithm;
  direction: 'asc' | 'desc';
  label: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  contributionHistory: Array<{
    date: string;
    type: string;
    description: string;
  }>;
}

// Constants
const QUANTUM_LANGUAGES = ['Qiskit', 'Cirq', 'Q#', 'Quipper', 'PyQuil', 'Silq', 'QCL'];
const COMPLEXITY_OPTIONS = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)', 'O(n!)', 'Variable'];
const QUANTUM_OPERATIONS = ['H', 'X', 'Y', 'Z', 'CNOT', 'SWAP', 'Toffoli', 'S', 'T', 'Rx', 'Ry', 'Rz', 'U'];

const SORT_OPTIONS: SortOption[] = [
  { field: 'name', direction: 'asc', label: 'Name (A-Z)' },
  { field: 'name', direction: 'desc', label: 'Name (Z-A)' },
  { field: 'stars', direction: 'desc', label: 'Most Stars' },
  { field: 'stars', direction: 'asc', label: 'Least Stars' },
  { field: 'lastUpdated', direction: 'desc', label: 'Recently Updated' },
  { field: 'lastUpdated', direction: 'asc', label: 'Oldest Updated' },
];

// Pagination constants
const ITEMS_PER_PAGE = 5;

// Sample data
const sampleAlgorithms: Algorithm[] = [
  {
    _id: '1',
    name: 'Quantum Fourier Transform',
    description: 'Efficient implementation of the quantum Fourier transform with optimized gate sequences for enhanced performance.',
    version: '2.1.0',
    author: 'quantum_dev',
    stars: 245,
    userHasStarred: false,
    lastUpdated: '2024-03-15',
    language: 'Qiskit',
    complexity: 'O(n log n)',
    tags: ['transformation', 'fundamental', 'optimization'],
    collaborators: []
  },
  {
    _id: '2',
    name: "Grover's Search Algorithm",
    description: 'Quantum algorithm for unstructured search with quadratic speedup over classical algorithms.',
    version: '1.3.2',
    author: 'alice_quantum',
    stars: 189,
    userHasStarred: true,
    lastUpdated: '2024-03-10',
    language: 'Q#',
    complexity: 'O(√N)',
    tags: ['search', 'optimization', 'oracle'],
    collaborators: []
  },
  {
    _id: '3',
    name: 'QAOA for MaxCut',
    description: 'Quantum Approximate Optimization Algorithm implementation for the MaxCut problem with variational circuits.',
    version: '1.0.1',
    author: 'bob_researcher',
    stars: 156,
    userHasStarred: false,
    lastUpdated: '2024-03-08',
    language: 'Cirq',
    complexity: 'Variable',
    tags: ['optimization', 'NISQ', 'graph-theory'],
    collaborators: []
  }
];

export default function Repository() {
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [circuitName, setCircuitName] = useState('');
  const [circuitDescription, setCircuitDescription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [complexity, setComplexity] = useState('');
  const [numQubits, setNumQubits] = useState<number>(1);
  const [selectedOperations, setSelectedOperations] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [qasmFile, setQasmFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [algorithms, setAlgorithms] = useState<Algorithm[]>(sampleAlgorithms);
  
  // New state for enhanced features
  const [currentSort, setCurrentSort] = useState<SortOption>(SORT_OPTIONS[4]); // Default to recently updated
  const [currentPage, setCurrentPage] = useState(1);
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // Sidebar and profile menu state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // Simulate authentication check
  useEffect(() => {
    setIsLoggedIn(true);
    setFadeIn(true);
  }, []);

  // Handle sidebar open/close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close sidebar if click is outside the sidebar and the sidebar is open
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Handle click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
      if (showProfileMenu && profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, showProfileMenu]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      setIsLoggedIn(false);
      setShowProfileMenu(false);
      router.push('/');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
    }
  };

  // Filter algorithms based on search query and selected filter
  const filteredAlgorithms = useMemo(() => {
    return algorithms.filter(algo => {
      const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           algo.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || 
                           algo.tags.some(tag => tag.toLowerCase() === selectedFilter.toLowerCase());
      
      return matchesSearch && matchesFilter;
    });
  }, [algorithms, searchQuery, selectedFilter]);

  // Sort algorithms
  const sortedAlgorithms = useMemo(() => {
    return [...filteredAlgorithms].sort((a, b) => {
      const { field, direction } = currentSort;
      
      if (field === 'lastUpdated') {
        const dateA = new Date(a[field]);
        const dateB = new Date(b[field]);
        return direction === 'asc' 
          ? dateA.getTime() - dateB.getTime() 
          : dateB.getTime() - dateA.getTime();
      }
      
      if (field === 'complexity') {
        const complexityOrder = COMPLEXITY_OPTIONS;
        const indexA = complexityOrder.indexOf(a[field]);
        const indexB = complexityOrder.indexOf(b[field]);
        return direction === 'asc' ? indexA - indexB : indexB - indexA;
      }
      
      if (typeof a[field] === 'string') {
        return direction === 'asc'
          ? (a[field] as string).localeCompare(b[field] as string)
          : (b[field] as string).localeCompare(a[field] as string);
      } else {
        return direction === 'asc'
          ? (a[field] as number) - (b[field] as number)
          : (b[field] as number) - (a[field] as number);
      }
    });
  }, [filteredAlgorithms, currentSort]);

  // Paginate algorithms
  const paginatedAlgorithms = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAlgorithms.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedAlgorithms, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedAlgorithms.length / ITEMS_PER_PAGE);

  // Reset to first page when filters or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter, currentSort]);

  // Handle algorithm upload
  const uploadAlgorithm = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAlgorithm: Algorithm = {
      _id: Date.now().toString(),
      name: circuitName,
      description: circuitDescription,
      version: '1.0.0',
      author: { 
        id: 'current-user', 
        name: 'Current User', 
        avatar: '/images/default-avatar.png',
        role: 'user'
      },
      stars: 0,
      userHasStarred: false,
      lastUpdated: new Date().toISOString().split('T')[0],
      language: selectedLanguage,
      complexity: complexity,
      tags: selectedTags,
      comments: [],
      collaborators: [],
      forks: 0
    };
    
    setAlgorithms([newAlgorithm, ...algorithms]);
    
    // Reset form
    setCircuitName('');
    setCircuitDescription('');
    setSelectedLanguage('');
    setComplexity('');
    setNumQubits(1);
    setSelectedOperations([]);
    setSelectedTags([]);
    setQasmFile(null);
    
    setIsUploadModalOpen(false);
    toast.success('Algorithm uploaded successfully!');
  };

  const handleStarToggle = (algorithmId: string) => {
    setAlgorithms(prevAlgorithms => 
      prevAlgorithms.map(algo => {
        if (algo._id === algorithmId) {
          return {
            ...algo,
            stars: algo.userHasStarred ? algo.stars - 1 : algo.stars + 1,
            userHasStarred: !algo.userHasStarred
          };
        }
        return algo;
      })
    );
    
    toast.success('Star preference updated!');
  };


  return (
    <div className={`min-h-screen bg-black text-white ${fadeIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-950 border-b border-gray-800 text-white p-4 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-300 hover:text-white focus:outline-none transition-colors duration-200 p-1"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
            <h1 className="text-2xl font-bold ml-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              XREPO
            </h1>
          </div>

          

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-200 flex items-center gap-2 text-gray-200 hover:text-white"
            >
              <FiUpload className="text-sm" /> Upload Algorithm
            </button>
            
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-200 flex items-center text-gray-200 hover:text-white"
              >
                <FiUser className="mr-2" />
                Profile
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl py-2 z-50">
                  <Link href="/profile" className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center text-gray-300 hover:text-white transition-colors">
                    <FiUser className="mr-2" />
                    My Profile
                  </Link>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center text-gray-300 hover:text-white transition-colors">
                    <FiSettings className="mr-2" />
                    Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center text-gray-300 hover:text-white transition-colors">
                    <FiCreditCard className="mr-2" />
                    Billing
                  </button>
                  <div className="border-t border-gray-700 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 text-red-400 hover:text-red-300 flex items-center transition-colors"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main className={`pt-24 px-8 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold flex items-center text-gray-100">
                    <FiUpload className="mr-2" /> Upload Quantum Algorithm
                  </h2>
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="text-gray-400 hover:text-gray-200 transition-colors text-xl"
                  >
                    <FiX />
                  </button>
                </div>
                
                <form onSubmit={uploadAlgorithm} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Algorithm Name</label>
                      <input
                        type="text"
                        value={circuitName}
                        onChange={(e) => setCircuitName(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:border-gray-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Language</label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:border-gray-500 focus:outline-none"
                        required
                      >
                        <option value="">Select Language</option>
                        {QUANTUM_LANGUAGES.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Description</label>
                    <textarea
                      value={circuitDescription}
                      onChange={(e) => setCircuitDescription(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:border-gray-500 focus:outline-none h-24"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Complexity</label>
                      <select
                        value={complexity}
                        onChange={(e) => setComplexity(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:border-gray-500 focus:outline-none"
                        required
                      >
                        <option value="">Select Complexity</option>
                        {COMPLEXITY_OPTIONS.map(comp => (
                          <option key={comp} value={comp}>{comp}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Number of Qubits</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={numQubits}
                        onChange={(e) => setNumQubits(parseInt(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:border-gray-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(false)}
                      className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 hover:text-white transition-all"
                    >
                      Upload Algorithm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Search, Filter, and Sort Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search algorithms..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-400 focus:border-gray-600 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <div className="flex gap-2">
              <select
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-gray-600 focus:outline-none"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">All Algorithms</option>
                <option value="optimization">Optimization</option>
                <option value="simulation">Simulation</option>
                <option value="ml">Machine Learning</option>
                <option value="fundamental">Fundamental</option>
                <option value="oracle">Oracle-based</option>
                <option value="nisq">NISQ</option>
              </select>
              
              <div className="relative" ref={sortMenuRef}>
                <button 
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 flex items-center gap-2 hover:border-gray-600 transition-colors"
                  onClick={() => setShowSortMenu(!showSortMenu)}
                >
                  <FiFilter size={16} />
                  Sort
                  <FiChevronDown size={16} />
                </button>
                
                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-10">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={`${option.field}-${option.direction}`}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center justify-between transition-colors ${
                          currentSort.field === option.field && currentSort.direction === option.direction
                            ? 'bg-gray-800 text-gray-200'
                            : 'text-gray-300'
                        }`}
                        onClick={() => {
                          setCurrentSort(option);
                          setShowSortMenu(false);
                        }}
                      >
                        {option.label}
                        {currentSort.field === option.field && currentSort.direction === option.direction && (
                          <span className="text-gray-400">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm List Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-100">Available Algorithms</h2>
            <div className="text-sm text-gray-400">
              Showing {paginatedAlgorithms.length} of {filteredAlgorithms.length} results
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500 mb-2"></div>
              <p className="text-gray-400">Loading algorithms...</p>
            </div>
          ) : paginatedAlgorithms.length === 0 ? (
            <div className="bg-gray-900 border border-gray-700 p-8 rounded-xl text-center">
              <p className="text-gray-400 mb-4">No algorithms found matching your criteria.</p>
              <button 
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-gray-200"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedAlgorithms.map((algo) => (
                <AlgorithmItem 
                  key={algo._id} 
                  algorithm={algo} 
                  onStarToggle={handleStarToggle}
                />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg p-1">
                <button
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`w-8 h-8 rounded-md transition-colors ${
                      currentPage === page
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function AlgorithmItem({ algorithm, onStarToggle }: { algorithm: Algorithm; onStarToggle: (id: string) => void }) {
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays <= 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const authorName = typeof algorithm.author === 'string' ? algorithm.author : algorithm.author.name;

  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl hover:border-gray-600 transition-all duration-200 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 text-gray-100 group-hover:text-white transition-colors">
            {algorithm.name}
          </h3>
          <p className="text-gray-400 mb-3 leading-relaxed">
            {truncateDescription(algorithm.description)}
          </p>
          <div className="flex gap-2 flex-wrap">
            {algorithm.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-800 border border-gray-600 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 ml-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onStarToggle(algorithm._id)}
              className="flex items-center gap-1 text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <FiStar className={algorithm.userHasStarred ? "text-yellow-400 fill-current" : ""} /> 
              <span className={algorithm.userHasStarred ? "text-yellow-400" : ""}>
                {algorithm.stars}
              </span>
            </button>
          </div>
          <button className="px-4 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-700 hover:text-white hover:border-gray-500 transition-all">
            View Details
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <FiGitBranch /> Version {algorithm.version}
        </span>
        <span className="flex items-center gap-1">
          <FiGitCommit /> Updated: {formatDate(algorithm.lastUpdated)}
        </span>
        <span>{algorithm.language}</span>
        <span>By {authorName}</span>
        <span>Complexity: {algorithm.complexity}</span>
      </div>
    </div>
  );
}
