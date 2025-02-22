import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";

export default function QuantumFourierTransform() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black text-white p-8">
      <nav className="mb-8">
        <Link href="/repository" className="text-blue-400 hover:underline">
          ← Back to Repository
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Quantum Fourier Transform (QFT)</h1>
        
        {/* Mathematical Description */}
        <Card className="bg-gray-800/50 p-6 mb-8">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Mathematical Description</h2>
            <p className="text-gray-300 mb-4">
              The Quantum Fourier Transform is defined as:
            </p>
            <div className="bg-black/30 p-4 rounded-lg overflow-x-auto">
              <code className="text-green-400">
                {`|j⟩ ↦ \\frac{1}{\\sqrt{N}} \\sum_{k=0}^{N-1} e^{2\\pi ijk/N} |k⟩`}
              </code>
            </div>
            <p className="text-gray-300 mt-4">
              Where N = 2^n for n qubits, and j ranges from 0 to N-1.
            </p>
          </CardContent>
        </Card>

        {/* Circuit Implementation */}
        <Card className="bg-gray-800/50 p-6 mb-8">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Circuit Implementation</h2>
            <div className="bg-black/30 p-4 rounded-lg mb-4">
              {/* Add circuit diagram here */}
              <p className="text-gray-300">Circuit diagram visualization</p>
            </div>
            <p className="text-gray-300">
              The QFT circuit consists of Hadamard gates and controlled phase rotations.
            </p>
          </CardContent>
        </Card>

        {/* Applications */}
        <Card className="bg-gray-800/50 p-6 mb-8">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Applications</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Phase estimation</li>
              <li>Shor's algorithm</li>
              <li>Quantum signal processing</li>
              <li>Quantum machine learning</li>
            </ul>
          </CardContent>
        </Card>

        {/* Code Example */}
        <Card className="bg-gray-800/50 p-6">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Code Example</h2>
            <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
              <code className="text-green-400">
{`# Qiskit implementation of QFT
def qft(circuit, n):
    """Apply QFT to n qubits."""
    for j in range(n):
        for k in range(j):
            circuit.cp(pi/float(2**(j-k)), k, j)
        circuit.h(j)`}
              </code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 