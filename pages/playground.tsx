import { useState, useEffect, useCallback } from 'react';
import { QuantumSimulator } from '../lib/quantum/simulator';
import { QuantumGates, ControlledGates, GateType, ControlledGateType } from '../lib/quantum/gates';
import { QuantumCircuit, Operation } from '../components/QuantumCircuit';
import { toast } from 'react-hot-toast';

export default function QuantumPlayground() {
  // State management
  const [numQubits, setNumQubits] = useState(3);
  const [simulator, setSimulator] = useState<QuantumSimulator>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [selectedGate, setSelectedGate] = useState<GateType | ControlledGateType>('H');
  const [selectedQubit, setSelectedQubit] = useState(0);
  const [controlQubit, setControlQubit] = useState<number | undefined>(undefined);
  const [results, setResults] = useState<{ [key: number]: number }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize simulator
  useEffect(() => {
    try {
      setSimulator(new QuantumSimulator(numQubits));
      setOperations([]);
      setResults({});
      setError(null);
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
      const newOperation = {
        gate: selectedGate,
        target: selectedQubit,
        control: controlQubit,
        time: operations.length
      };

      // Validate operation
      if (selectedQubit >= numQubits) {
        throw new Error('Invalid target qubit');
      }
      if (controlQubit !== undefined && controlQubit >= numQubits) {
        throw new Error('Invalid control qubit');
      }

      // Apply gate to simulator
      if (controlQubit !== undefined && selectedGate in ControlledGates) {
        simulator.applyControlledGate(
          JSON.parse(JSON.stringify(QuantumGates[ControlledGates[selectedGate as ControlledGateType] as GateType])),
          controlQubit,
          selectedQubit
        );
      } else {
        simulator.applyGate(
          JSON.parse(JSON.stringify(QuantumGates[selectedGate as GateType])),
          selectedQubit
        );
      }

      // Update state
      setOperations(prev => [...prev, newOperation]);
      
      // Update probabilities
      const probabilities = simulator.getProbabilities();
      setResults(Object.fromEntries(
        probabilities.map((prob, i) => [i, prob])
      ));

      toast.success('Gate applied successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to apply gate';
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  }, [simulator, selectedGate, selectedQubit, controlQubit, operations.length, numQubits]);

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

  // Reset circuit
  const resetCircuit = useCallback(() => {
    setSimulator(new QuantumSimulator(numQubits));
    setOperations([]);
    setResults({});
    setError(null);
    toast.success('Circuit reset');
  }, [numQubits]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Quantum Circuit Playground</h1>

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
            <button
              onClick={resetCircuit}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors"
              disabled={isProcessing}
            >
              Reset Circuit
            </button>
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
                    className={`p-2 rounded ${
                      selectedGate === gate ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                  >
                    {gate}
                  </button>
                ))}
                {Object.keys(ControlledGates).map(gate => (
                  <button
                    key={gate}
                    onClick={() => setSelectedGate(gate as ControlledGateType)}
                    className={`p-2 rounded ${
                      selectedGate === gate ? 'bg-purple-600' : 'bg-gray-700'
                    }`}
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
                    className={`p-2 rounded ${
                      selectedQubit === i ? 'bg-green-600' : 'bg-gray-700'
                    }`}
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
                        className={`p-2 rounded ${
                          controlQubit === i ? 'bg-purple-600' : 'bg-gray-700'
                        }`}
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
              className={`w-full p-3 rounded-lg transition-colors ${
                isProcessing 
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
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
                      className={`px-2 py-1 rounded transition-colors ${
                        isProcessing 
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
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
        </div>
      </div>
    </div>
  );
} 