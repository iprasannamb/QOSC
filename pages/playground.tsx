import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FiUser, FiLogOut, FiSettings, FiCreditCard, FiZap, FiRotateCcw } from 'react-icons/fi';
import { QuantumSimulator } from '../lib/quantum/simulator';
import { QuantumGates, GateType, ControlledGates, ControlledGateType } from '../lib/quantum/gates';
import { QuantumCircuit, Operation } from '../components/QuantumCircuit';
import { circuitToQASM } from '../lib/quantum/qasm';
import Sidebar from '../components/Sidebar';
import { logoutUser } from '@/utils/firebase';
import Histogram from '@/components/Histogram';

export default function Playground() {
  const router = useRouter();
  
  // Sidebar and profile menu state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  // State management for quantum playground
  const [numQubits, setNumQubits] = useState(3);
  const [simulator, setSimulator] = useState<QuantumSimulator>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [selectedGate, setSelectedGate] = useState<GateType | ControlledGateType>('H');
  const [selectedQubit, setSelectedQubit] = useState(0);
  const [controlQubit, setControlQubit] = useState<number | undefined>(undefined);
  const [results, setResults] = useState<{ [key: number]: number }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [measurementResults, setMeasurementResults] = useState<{ [key: string]: number }>({});

  // AI Assistant state
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Operation[]>([]);

  // Add state for operation history
  const [operationHistory, setOperationHistory] = useState<Operation[][]>([]);
  const [simulatorHistory, setSimulatorHistory] = useState<QuantumSimulator[]>([]);
  const [resultsHistory, setResultsHistory] = useState<Record<string, any>[]>([]);

  // Simulate authentication check
  useEffect(() => {
    // For demo, we'll assume the user is logged in
    setIsLoggedIn(true);
    setFadeIn(true);
  }, []);

  // Handle click outside sidebar
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

  // Handle click outside profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileMenu && profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      setShowProfileMenu(false);
      router.push('/');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
    }
  };

  // Initialize simulator with history tracking
  useEffect(() => {
    try {
      const newSimulator = new QuantumSimulator(numQubits);
      setSimulator(newSimulator);
      setOperations([]);
      setResults({});
      setError(null);
      
      // Reset history
      setOperationHistory([[]]);
      setSimulatorHistory([newSimulator]);
      setResultsHistory([{}]);
    } catch (err) {
      setError('Failed to initialize quantum simulator');
      toast.error('Failed to initialize quantum simulator');
    }
  }, [numQubits]);

  // Memoized gate application
  const applyGate = useCallback(async () => {
    if (!simulator) {
      toast.error('Simulator not initialized');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Validate operation
      if (selectedQubit >= numQubits) {
        throw new Error('Invalid target qubit');
      }
      
      if (controlQubit !== undefined) {
        if (controlQubit >= numQubits) {
          throw new Error('Invalid control qubit');
        }
        
        if (controlQubit === selectedQubit) {
          throw new Error('Control and target qubits cannot be the same');
        }
        
        if (!(selectedGate in ControlledGates)) {
          throw new Error(`Gate ${selectedGate} cannot be controlled`);
        }
      }
      
      // Find the maximum time for the current qubit
      const maxTimeForQubit = operations
        .filter(op => op.target === selectedQubit || op.control === selectedQubit)
        .reduce((max, op) => Math.max(max, op.time), -1);
      
      // Check for overlapping gates
      const conflictingOps = operations.filter(op => 
        (op.time === maxTimeForQubit + 1) && 
        (op.target === selectedQubit || op.control === selectedQubit)
      );
      
      if (conflictingOps.length > 0) {
        throw new Error('Gate conflicts with existing operation at this time step');
      }
      
      const newOperation = {
        gate: selectedGate,
        target: selectedQubit,
        control: controlQubit,
        time: maxTimeForQubit + 1
      };

      // Clone the current simulator for history
      const newSimulator = simulator.clone();

      // Apply gate to simulator
      if (controlQubit !== undefined) {
        newSimulator.applyControlledGate(
          JSON.parse(JSON.stringify(QuantumGates[ControlledGates[selectedGate as ControlledGateType] as GateType])),
          controlQubit,
          selectedQubit
        );
      } else {
        newSimulator.applyGate(
          JSON.parse(JSON.stringify(QuantumGates[selectedGate as GateType])),
          selectedQubit
        );
      }

      // Update operations
      const newOperations = [...operations, newOperation];
      
      // Update probabilities
      const probabilities = newSimulator.getProbabilities();
      const newResults = Object.fromEntries(
        probabilities.map((prob, i) => [i, prob])
      );

      // Update state
      setOperations(newOperations);
      setSimulator(newSimulator);
      setResults(newResults);
      
      // Update history
      setOperationHistory(prev => [...prev, newOperations]);
      setSimulatorHistory(prev => [...prev, newSimulator]);
      setResultsHistory(prev => [...prev, newResults]);

      toast.success('Gate applied successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to apply gate';
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  }, [simulator, selectedGate, selectedQubit, controlQubit, operations, numQubits]);

  // Memoized measurement function
  const measureQubit = useCallback(async (qubit: number) => {
    if (!simulator) {
      toast.error('Simulator not initialized');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { result, probability } = simulator.measure(qubit);
      setResults(prev => ({
        ...prev,
        [qubit]: result
      }));
      setMeasurementResults(prev => ({
        ...prev,
        [`q${qubit}`]: (prev[`q${qubit}`] || 0) + 1
      }));
      toast.success(`Measurement result: |${result}⟩ with probability ${(probability * 100).toFixed(2)}%`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to measure qubit';
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  }, [simulator]);

  // Handle qubit number change
  const handleQubitChange = useCallback((value: number) => {
    const numQubits = Math.min(Math.max(1, value), 8);
    setNumQubits(numQubits);
    setSelectedQubit(0);
    setControlQubit(undefined);
  }, []);

  // Reset circuit with history tracking
  const resetCircuit = useCallback(() => {
    const newSimulator = new QuantumSimulator(numQubits);
    setSimulator(newSimulator);
    setOperations([]);
    setResults({});
    setMeasurementResults({});
    setError(null);
    
    // Reset history
    setOperationHistory([[]]);
    setSimulatorHistory([newSimulator]);
    setResultsHistory([{}]);
    
    toast.success('Circuit reset');
  }, [numQubits]);

  // Export circuit to QASM
  const handleExport = useCallback(() => {
    try {
      const qasmCode = circuitToQASM(operations, numQubits);
      const blob = new Blob([qasmCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quantum_circuit.qasm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Circuit exported successfully');
    } catch (err) {
      toast.error('Failed to export circuit');
      console.error(err);
    }
  }, [operations, numQubits]);

  // AI Assistant functions
  const handleAiPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiPrompt(e.target.value);
  };
  
  const generateCircuit = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a description for the circuit');
      return;
    }
    
    setIsAiProcessing(true);
    
    try {
      // Call the OpenAI API through our backend endpoint
      const response = await fetch('/api/quantum-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          numQubits: numQubits
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate circuit');
      }
      
      const data = await response.json();
      
      // Set the AI response text
      setAiResponse(data.explanation || "I've generated a quantum circuit based on your description.");
      
      // Parse the operations from the response
      if (data.operations && Array.isArray(data.operations)) {
        setAiSuggestions(data.operations);
      } else {
        setAiSuggestions([]);
        toast.warning('No valid circuit operations were generated');
      }
    } catch (error) {
      console.error('Error generating circuit:', error);
      setAiResponse('Sorry, there was an error generating the circuit. Please try again.');
      setAiSuggestions([]);
      toast.error('Failed to generate circuit');
    } finally {
      setIsAiProcessing(false);
    }
  };
  
  const applyAiSuggestions = () => {
    if (aiSuggestions.length === 0) {
      toast.error('No AI suggestions to apply');
      return;
    }
    
    try {
      // Reset the simulator
      const newSimulator = new QuantumSimulator(numQubits);
      
      // Apply each operation
      aiSuggestions.forEach(op => {
        // Ensure gate is a valid type
        const gate = op.gate as GateType | ControlledGateType;
        
        // Ensure target is a number
        const target = typeof op.target === 'number' ? op.target : parseInt(String(op.target), 10);
        
        // Ensure control is a number if present
        const control = op.control !== undefined 
          ? (typeof op.control === 'number' ? op.control : parseInt(String(op.control), 10))
          : undefined;
        
        if (control !== undefined && gate in ControlledGates) {
          newSimulator.applyControlledGate(
            JSON.parse(JSON.stringify(QuantumGates[ControlledGates[gate as ControlledGateType] as GateType])),
            control,
            target
          );
        } else {
          newSimulator.applyGate(
            JSON.parse(JSON.stringify(QuantumGates[gate as GateType])),
            target
          );
        }
      });
      
      // Update state
      setSimulator(newSimulator);
      setOperations(aiSuggestions);
      
      // Update probabilities
      const probabilities = newSimulator.getProbabilities();
      setResults(Object.fromEntries(
        probabilities.map((prob, i) => [i, prob])
      ));
      
      // Update history
      setOperationHistory(prev => [...prev, aiSuggestions]);
      setSimulatorHistory(prev => [...prev, newSimulator]);
      setResultsHistory(prev => [...prev, Object.fromEntries(
        probabilities.map((prob, i) => [i, prob])
      )]);
      
      toast.success('AI circuit applied successfully');
      setShowAIAssistant(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to apply AI circuit';
      setError(message);
      toast.error(message);
    }
  };

  // Undo function
  const undoOperation = useCallback(() => {
    // Check if we have history to undo
    if (operationHistory.length <= 1) {
      toast.error('Nothing to undo');
      return;
    }

    // Get previous state
    const prevIndex = operationHistory.length - 2;
    const prevOperations = operationHistory[prevIndex];
    const prevSimulator = simulatorHistory[prevIndex];
    const prevResults = resultsHistory[prevIndex];

    // Update state
    setOperations(prevOperations);
    setSimulator(prevSimulator);
    setResults(prevResults);
    
    // Update history by removing the last entry
    setOperationHistory(prev => prev.slice(0, -1));
    setSimulatorHistory(prev => prev.slice(0, -1));
    setResultsHistory(prev => prev.slice(0, -1));

    toast.success('Operation undone');
  }, [operationHistory, simulatorHistory, resultsHistory]);

  return (
    <div className={`min-h-screen bg-gradient-to-r from-gray-900 to-black text-white ${fadeIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 z-40 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleSidebar}
              className="text-white focus:outline-none"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
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
                  d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                ></path>
              </svg>
            </button>
            <Link href="/" className="text-2xl font-bold ml-4">
              XREPO
            </Link>
          </div>

          {/* Playground-specific buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExport}
              disabled={operations.length === 0}
              className={`px-4 py-2 rounded-lg ${
                operations.length === 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              Export to QASM
            </button>
            
            <button
              onClick={() => setShowAIAssistant(true)}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors flex items-center"
            >
              <FiZap className="mr-2" />
              AI Assistant
            </button>
            
            {/* Profile Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center"
              >
                <FiUser className="mr-2" />
                Profile
              </button>
              
              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div 
                  ref={profileMenuRef}
                  className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-700"
                >
                  <Link 
                    href="/profile" 
                    className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    <FiUser className="mr-2" />
                    Go to Profile
                  </Link>
                  <Link 
                    href="/subscription" 
                    className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    <FiCreditCard className="mr-2" />
                    My Subscription
                  </Link>
                  <Link 
                    href="/settings" 
                    className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    <FiSettings className="mr-2" />
                    Settings and Privacy
                  </Link>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
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
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Quantum Circuit Playground</h1>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Circuit controls */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl">Controls</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={resetCircuit}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
                    disabled={isProcessing}
                  >
                    Reset Circuit
                  </button>
                  <button
                    onClick={undoOperation}
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 transition-colors flex items-center"
                    disabled={operationHistory.length <= 1 || isProcessing}
                  >
                    <FiRotateCcw className="mr-2" />
                    Undo
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Number of Qubits</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={numQubits}
                    onChange={e => handleQubitChange(Number(e.target.value))}
                    className="bg-gray-700 p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2">Select Gate</label>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.keys(QuantumGates).map(gate => (
                      <button
                        key={gate}
                        onClick={() => setSelectedGate(gate as GateType)}
                        className={`p-2 rounded ${selectedGate === gate ? 'bg-blue-600' : 'bg-gray-700'}`}
                      >
                        {gate}
                      </button>
                    ))}
                    {Object.keys(ControlledGates).map(gate => (
                      <button
                        key={gate}
                        onClick={() => setSelectedGate(gate as ControlledGateType)}
                        className={`p-2 rounded ${selectedGate === gate ? 'bg-purple-600' : 'bg-gray-700'}`}
                      >
                        {gate}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Target Qubit</label>
                  <div className="flex gap-2">
                    {Array.from({ length: numQubits }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedQubit(i)}
                        className={`p-2 rounded ${selectedQubit === i ? 'bg-green-600' : 'bg-gray-700'}`}
                      >
                        q{i}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedGate in ControlledGates && (
                  <div>
                    <label className="block mb-2">Control Qubit</label>
                    <div className="flex gap-2">
                      {Array.from({ length: numQubits }).map((_, i) => (
                        i !== selectedQubit && (
                          <button
                            key={i}
                            onClick={() => setControlQubit(i)}
                            className={`p-2 rounded ${controlQubit === i ? 'bg-purple-600' : 'bg-gray-700'}`}
                          >
                            q{i}
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={applyGate}
                  disabled={isProcessing}
                  className={`w-full p-3 rounded-lg transition-colors ${isProcessing ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isProcessing ? 'Processing...' : 'Add Gate'}
                </button>
              </div>
            </div>

            {/* Circuit visualization */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl mb-4">Circuit</h2>
              <QuantumCircuit
                numQubits={numQubits}
                operations={operations}
                onGateClick={op => {
                  toast(`Gate: ${op.gate}, Target: ${op.target}${op.control !== undefined ? `, Control: ${op.control}` : ''}`);
                }}
              />
              
              {/* Measurement results */}
              <div className="mt-4">
                <h3 className="text-xl mb-2">Measurement Results</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: numQubits }).map((_, i) => (
                    <div key={i} className="bg-gray-700 p-4 rounded">
                      <div className="flex justify-between mb-2">
                        <span>Qubit {i}</span>
                        <button
                          onClick={() => measureQubit(i)}
                          disabled={isProcessing}
                          className={`px-2 py-1 rounded transition-colors ${isProcessing ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                          Measure
                        </button>
                      </div>
                      <div className="text-xl">
                        {results[i] !== undefined 
                          ? `|${results[i]}⟩ (${(results[i] * 100).toFixed(2)}%)`
                          : 'Not measured'
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Histogram Display */}
              <Histogram results={measurementResults} />
            </div>

            {/* QASM Code Display */}
            <div className="bg-gray-800 p-6 rounded-lg mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl">Live QASM Code</h2>
                {/* <button
                  onClick={handleExport}
                  disabled={operations.length === 0}
                  className={`px-4 py-2 rounded-lg ${
                    operations.length === 0
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  Export to File
                </button> */}
              </div>
              <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <pre className="text-green-400 font-mono text-sm">
                  {operations.length > 0 
                    ? circuitToQASM(operations, numQubits)
                    : 'OPENQASM 2.0;\ninclude "qelib1.inc";\n\n' + 
                      `qreg q[${numQubits}];\n` +
                      `creg c[${numQubits}];\n\n` +
                      '// Add gates to see QASM code'
                  }
                </pre>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                OpenQASM is a quantum assembly language for describing quantum circuits. This code can be used with other quantum computing platforms.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800 z-10 py-2">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <FiZap className="mr-2 text-purple-400" />
                Quantum Circuit AI Assistant
              </h2>
              <button 
                onClick={() => setShowAIAssistant(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Describe the quantum circuit you want to create
              </label>
              <textarea
                value={aiPrompt}
                onChange={handleAiPromptChange}
                placeholder="e.g., Create a Bell state circuit, or implement Grover's search algorithm"
                className="w-full bg-gray-700 text-white rounded-lg p-3 min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-between mb-6">
              <button
                onClick={generateCircuit}
                disabled={isAiProcessing || !aiPrompt.trim()}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  isAiProcessing || !aiPrompt.trim()
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                } transition-colors`}
              >
                {isAiProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiZap className="mr-2" />
                    Generate Circuit
                  </>
                )}
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setAiPrompt("Create a Bell state circuit")}
                  className="px-3 py-1 text-sm rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Bell State
                </button>
                <button
                  onClick={() => setAiPrompt("Implement Grover's search algorithm")}
                  className="px-3 py-1 text-sm rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Grover's
                </button>
                <button
                  onClick={() => setAiPrompt("Put all qubits in superposition")}
                  className="px-3 py-1 text-sm rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Superposition
                </button>
              </div>
            </div>
            
            {aiResponse && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-300 mb-2">AI Response:</h3>
                <div className="bg-gray-700/50 rounded-lg p-4 text-gray-200 max-h-[200px] overflow-y-auto">
                  {aiResponse}
                </div>
              </div>
            )}
            
            {aiSuggestions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-300 mb-2">Suggested Circuit:</h3>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <QuantumCircuit
                    numQubits={numQubits}
                    operations={aiSuggestions}
                    onGateClick={op => {
                      toast(`Gate: ${op.gate}, Target: ${op.target}${op.control !== undefined ? `, Control: ${op.control}` : ''}`);
                    }}
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={applyAiSuggestions}
                disabled={aiSuggestions.length === 0}
                className={`px-4 py-2 rounded-lg ${
                  aiSuggestions.length === 0
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } transition-colors`}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How to Use Guide */}
      <section className="mt-16 px-8 pb-16 transition-all duration-300 bg-gray-900/50 backdrop-blur-sm rounded-lg mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold pt-8 mb-6 text-blue-300">Quantum Circuit Simulator Guide</h2>
        
        <div className="bg-gray-800/70 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-200">What is a Quantum Circuit Simulator?</h3>
          <p className="text-gray-300 mb-4">
            A quantum circuit simulator is a software tool that models the behavior of quantum computers without requiring actual quantum hardware. It allows you to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
            <li>Design and test quantum algorithms</li>
            <li>Manipulate quantum states through gates and measurements</li>
            <li>Visualize quantum phenomena like superposition and entanglement</li>
            <li>Learn quantum computing concepts in an interactive environment</li>
          </ul>
          <p className="text-gray-300">
            Unlike classical computers that use bits (0 or 1), quantum computers use quantum bits or "qubits" that can exist in superpositions of states, enabling new types of computation.
          </p>
        </div>
        
        <div className="bg-gray-800/70 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-200">How Our Simulator Works</h3>
          <p className="text-gray-300 mb-4">
            Our quantum simulator uses linear algebra to track the quantum state vector of your system:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-gray-300">
            <li className="pb-2 border-b border-gray-700">
              <span className="font-medium text-white">State Representation:</span> Each qubit doubles the size of the quantum state space. For n qubits, we track 2ⁿ complex amplitudes.
            </li>
            <li className="pb-2 border-b border-gray-700">
              <span className="font-medium text-white">Gate Operations:</span> Quantum gates are represented as unitary matrices that transform the state vector.
            </li>
            <li className="pb-2 border-b border-gray-700">
              <span className="font-medium text-white">Measurements:</span> When measuring a qubit, we calculate outcome probabilities based on the state vector, then randomly collapse the state according to these probabilities.
            </li>
            <li>
              <span className="font-medium text-white">Visualization:</span> Results are displayed as histograms showing the distribution of measurement outcomes.
            </li>
          </ol>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-200">Workflow</h3>
            <div className="bg-gray-800/70 p-6 rounded-lg">
              <ol className="list-decimal list-inside space-y-4 text-gray-300">
                <li className="pb-2 border-b border-gray-700">
                  <span className="font-medium text-white">Configure Circuit:</span> Select the number of qubits (1-8) for your quantum circuit.
                </li>
                <li className="pb-2 border-b border-gray-700">
                  <span className="font-medium text-white">Add Gates:</span> Choose a gate type, select target qubit (and control qubit for controlled operations), then click "Add Gate".
                </li>
                <li className="pb-2 border-b border-gray-700">
                  <span className="font-medium text-white">Measure Qubits:</span> Click "Measure" on any qubit to collapse its quantum state and record the result.
                </li>
                <li className="pb-2 border-b border-gray-700">
                  <span className="font-medium text-white">View Results:</span> See measurement outcomes in the histogram display, showing the distribution of measured states.
                </li>
                <li>
                  <span className="font-medium text-white">AI Assistant:</span> Use the AI Assistant to generate circuits from natural language descriptions.
                </li>
              </ol>
            </div>
            
            <h3 className="text-xl font-semibold mt-8 mb-4 text-blue-200">Understanding the Histogram</h3>
            <div className="bg-gray-800/70 p-6 rounded-lg">
              <p className="text-gray-300 mb-4">
                The histogram displays the frequency of each measured quantum state:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>
                  <span className="font-medium text-white">X-axis:</span> Represents the measured qubit states (e.g., "q0", "q1").
                </li>
                <li>
                  <span className="font-medium text-white">Y-axis:</span> Shows the count/frequency of each measurement outcome.
                </li>
                <li>
                  <span className="font-medium text-white">Bars:</span> The height of each bar indicates how many times that particular state was measured.
                </li>
                <li>
                  <span className="font-medium text-white">Interpretation:</span> Taller bars represent more probable outcomes in the quantum system.
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-800/70 p-6 rounded-lg">
              <div className="flex flex-col items-center space-y-6">
                {/* Step 1 */}
                <div className="w-full bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">1</div>
                    <div className="ml-4">
                      <h4 className="text-white font-medium">Configure Circuit</h4>
                      <p className="text-gray-300 text-sm">Set number of qubits</p>
                    </div>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-500"></div>
                
                {/* Step 2 */}
                <div className="w-full bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">2</div>
                    <div className="ml-4">
                      <h4 className="text-white font-medium">Add Quantum Gates</h4>
                      <p className="text-gray-300 text-sm">Select gates and target qubits</p>
                    </div>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-500"></div>
                
                {/* Step 3 */}
                <div className="w-full bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">3</div>
                    <div className="ml-4">
                      <h4 className="text-white font-medium">Measure Qubits</h4>
                      <p className="text-gray-300 text-sm">Collapse quantum states</p>
                    </div>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-500"></div>
                
                {/* Step 4 */}
                <div className="w-full bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">4</div>
                    <div className="ml-4">
                      <h4 className="text-white font-medium">Analyze Results</h4>
                      <p className="text-gray-300 text-sm">View histogram of measurement outcomes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mt-8 mb-4 text-blue-200">Quantum Gates Reference</h3>
            <div className="bg-gray-800/70 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-3">Single-Qubit Gates</h4>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
                    <div className="ml-3">
                      <h5 className="text-white text-sm font-medium">Hadamard</h5>
                      <p className="text-gray-300 text-xs">Creates superposition</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">X</div>
                    <div className="ml-3">
                      <h5 className="text-white text-sm font-medium">Pauli-X</h5>
                      <p className="text-gray-300 text-xs">Bit flip (NOT gate)</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">Y</div>
                    <div className="ml-3">
                      <h5 className="text-white text-sm font-medium">Pauli-Y</h5>
                      <p className="text-gray-300 text-xs">Bit+phase flip</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">Z</div>
                    <div className="ml-3">
                      <h5 className="text-white text-sm font-medium">Pauli-Z</h5>
                      <p className="text-gray-300 text-xs">Phase flip</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                    <div className="ml-3">
                      <h5 className="text-white text-sm font-medium">S Gate</h5>
                      <p className="text-gray-300 text-xs">π/2 phase rotation</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
                    <div className="ml-3">
                      <h5 className="text-white text-sm font-medium">T Gate</h5>
                      <p className="text-gray-300 text-xs">π/4 phase rotation</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h4 className="text-lg font-medium text-white mb-3">Multi-Qubit Gates</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center text-white font-bold">CNOT</div>
                    <div className="ml-3">
                      <h5 className="text-white text-sm font-medium">CNOT</h5>
                      <p className="text-gray-300 text-xs">Controlled-NOT</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">CZ</div>
                    <div className="ml-3">
                      <h5 className="text-white text-sm font-medium">CZ</h5>
                      <p className="text-gray-300 text-xs">Controlled-Z</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">CS</div>
                    <div className="ml-3">
                      <h5 className="text-white text-sm font-medium">CS</h5>
                      <p className="text-gray-300 text-xs">Controlled-S</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">CT</div>
                    <div className="ml-3">
                      <h5 className="text-white text-sm font-medium">CT</h5>
                      <p className="text-gray-300 text-xs">Controlled-T</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}