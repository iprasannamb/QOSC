import Link from 'next/link';
import { useState } from 'react';

export default function Playground() {
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [circuit, setCircuit] = useState<string[]>([]);

  // Function to add a gate to the circuit
  const addGateToCircuit = (gate: string) => {
    setCircuit([...circuit, gate]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-gray-900 text-white p-8">
      <header className="text-center text-4xl font-extrabold mb-6">
        Quantum Circuit Playground
      </header>
      <p className="text-center text-lg mb-8">
        Design and simulate quantum circuits in real-time.
      </p>

      {/* Gate Selection */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-3xl mx-auto mb-6">
        <h2 className="text-2xl font-semibold mb-4">Select Quantum Gate</h2>
        <div className="flex gap-4">
          {["H", "X", "Y", "Z", "CX"].map((gate) => (
            <button
              key={gate}
              onClick={() => addGateToCircuit(gate)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {gate} Gate
            </button>
          ))}
        </div>
      </div>

      {/* Circuit Display */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Your Quantum Circuit</h2>
        <div className="p-4 bg-gray-900 rounded">
          {circuit.length === 0 ? (
            <p className="text-gray-400">No gates added yet.</p>
          ) : (
            <div className="flex gap-4">
              {circuit.map((gate, index) => (
                <span key={index} className="px-3 py-1 bg-green-500 rounded">
                  {gate}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="mt-8 text-center">
        <Link href="/">
          <span className="text-blue-400 hover:underline">← Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
