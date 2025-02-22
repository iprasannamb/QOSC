<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Button } from "@/components/ui/button";


const ComplexNumber = ({ magnitude, phase, size = 40 }: { magnitude: number; phase: number; size?: number }) => {
  return (
    <div 
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      <div 
        className="absolute inset-0 rounded-full border-2 border-blue-400"
        style={{
          transform: `rotate(${phase}deg)`,
        }}
      >
        <div 
          className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-blue-400 origin-bottom"
          style={{
            transform: `scaleY(${magnitude})`,
          }}
        />
      </div>
    </div>
  );
};

export default function QuantumFourierTransform() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [state, setState] = useState([
    { magnitude: 1, phase: 0 },
    { magnitude: 0, phase: 0 },
    { magnitude: 0, phase: 0 },
    { magnitude: 0, phase: 0 },
  ]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setStep((prev) => {
        const next = prev + 1;
        if (next >= 4) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });

      setState(prevState => {
        const newState = [...prevState];
        switch (step) {
          case 0:
            for (let i = 0; i < 4; i++) {
              newState[i] = { magnitude: 0.5, phase: i * 90 };
            }
            break;
          case 1:
            for (let i = 0; i < 4; i++) {
              newState[i].phase += i * 45;
            }
            break;
          case 2:
            for (let i = 0; i < 4; i++) {
              newState[i].magnitude = i % 2 === 0 ? 0.7 : 0.3;
            }
            break;
          default:
            break;
        }
        return newState;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, step]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black text-white p-8">
      <nav className="mb-8">
        <Link 
          href="/algorithms"
          className="text-blue-400 hover:text-blue-300 flex items-center gap-2 w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
          Back to Repository
=======
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
>>>>>>> 664288c610208e884ac5f4810e3c786051a1171a
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto">
<<<<<<< HEAD
        <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Quantum Fourier Transform (QFT)
        </h1>
        
        {/* Mathematical Description */}
        <Card className="bg-gray-800/50 backdrop-blur-sm p-6 mb-8 border border-gray-700">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">Mathematical Description</h2>
            <p className="text-gray-300 mb-4">
              The Quantum Fourier Transform is a quantum analog of the classical discrete Fourier transform, defined as:
            </p>
            <MathJaxContext>
              <div className="bg-black/30 p-6 rounded-lg overflow-x-auto">
                <MathJax className="text-green-400 text-lg">
                  {"\\[|j\\rangle \\mapsto \\frac{1}{\\sqrt{N}} \\sum_{k=0}^{N-1} e^{2\\pi ijk/N} |k\\rangle\\]"}
                </MathJax>
              </div>
            </MathJaxContext>
            <p className="text-gray-300 mt-4">
              Where N = 2<sup>n</sup> for n qubits, and j ranges from 0 to N-1.
=======
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
>>>>>>> 664288c610208e884ac5f4810e3c786051a1171a
            </p>
          </CardContent>
        </Card>

        {/* Circuit Implementation */}
<<<<<<< HEAD
        <Card className="bg-gray-800/50 backdrop-blur-sm p-6 mb-8 border border-gray-700">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">Circuit Implementation</h2>
            <div className="bg-black/30 p-4 rounded-lg mb-4">
              <Image
                src="/images/quantum-fourier-circuit.png"
                alt="QFT Circuit Diagram"
                width={600}
                height={300}
                className="mx-auto"
              />
            </div>
            <p className="text-gray-300">
              The QFT circuit implementation consists of:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Hadamard gates (H)</li>
              <li>Controlled phase rotations (R<sub>k</sub>)</li>
              <li>SWAP gates for bit reversal</li>
=======
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
>>>>>>> 664288c610208e884ac5f4810e3c786051a1171a
            </ul>
          </CardContent>
        </Card>

<<<<<<< HEAD
        {/* Interactive Visualization */}
        <Card className="bg-gray-800/50 backdrop-blur-sm p-6 mb-8 border border-gray-700">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">Interactive Visualization</h2>
            <div className="bg-black/30 p-6 rounded-lg">
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-4 items-center">
                  {state.map((s, i) => (
                    <div key={i} className="text-center">
                      <ComplexNumber magnitude={s.magnitude} phase={s.phase} />
                      <div className="mt-2 text-sm text-gray-400">|{i}⟩</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-4 items-center">
                  <Button
                    onClick={() => {
                      setStep(0);
                      setState([
                        { magnitude: 1, phase: 0 },
                        { magnitude: 0, phase: 0 },
                        { magnitude: 0, phase: 0 },
                        { magnitude: 0, phase: 0 },
                      ]);
                      setIsPlaying(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Start Animation
                  </Button>
                  
                  <div className="text-gray-300">
                    Step {step + 1}/4: {
                      step === 0 ? "Initial State" :
                      step === 1 ? "Applying Hadamard" :
                      step === 2 ? "Controlled Phase Rotations" :
                      "Final State"
                    }
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Example */}
        <Card className="bg-gray-800/50 backdrop-blur-sm p-6 border border-gray-700">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">Code Implementation</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="px-3 py-1 rounded bg-blue-500/20 text-blue-300 text-sm">Python</div>
                <div className="px-3 py-1 rounded bg-purple-500/20 text-purple-300 text-sm">Qiskit</div>
              </div>
              <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                <code className="text-green-400">
=======
        {/* Code Example */}
        <Card className="bg-gray-800/50 p-6">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Code Example</h2>
            <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
              <code className="text-green-400">
>>>>>>> 664288c610208e884ac5f4810e3c786051a1171a
{`# Qiskit implementation of QFT
def qft(circuit, n):
    """Apply QFT to n qubits."""
    for j in range(n):
        for k in range(j):
            circuit.cp(pi/float(2**(j-k)), k, j)
<<<<<<< HEAD
        circuit.h(j)
    
    # Apply swaps at the end
    for i in range(n//2):
        circuit.swap(i, n-i-1)`}
                </code>
              </pre>
            </div>
=======
        circuit.h(j)`}
              </code>
            </pre>
>>>>>>> 664288c610208e884ac5f4810e3c786051a1171a
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 