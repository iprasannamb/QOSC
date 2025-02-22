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

export default function ShorsAlgorithm() {
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
            // Initialize registers
            for (let i = 0; i < 4; i++) {
              newState[i] = { magnitude: 0.5, phase: 0 };
            }
            break;
          case 1:
            // Quantum Fourier Transform
            for (let i = 0; i < 4; i++) {
              newState[i].phase = i * 90;
            }
            break;
          case 2:
            // Modular exponentiation
            for (let i = 0; i < 4; i++) {
              newState[i].magnitude = i % 2 === 0 ? 0.7 : 0.3;
              newState[i].phase += 45;
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
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Shor's Factoring Algorithm
        </h1>
        
        {/* Mathematical Description */}
        <Card className="bg-gray-800/50 backdrop-blur-sm p-6 mb-8 border border-gray-700">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">Mathematical Description</h2>
            <p className="text-gray-300 mb-4">
              Shor's algorithm efficiently factors large numbers using quantum period finding:
            </p>
            <MathJaxContext>
              <div className="bg-black/30 p-6 rounded-lg overflow-x-auto">
                <MathJax className="text-green-400 text-lg">
                  {"\\[f(x) = a^x \\bmod N\\]"}
                  {"\\[\\text{Period } r \\text{ satisfies: } a^r \\equiv 1 \\pmod{N}\\]"}
                </MathJax>
              </div>
            </MathJaxContext>
            <p className="text-gray-300 mt-4">
              The algorithm achieves exponential speedup over classical methods, running in polynomial time O((log N)³).
            </p>
          </CardContent>
        </Card>

        {/* Circuit Implementation */}
        <Card className="bg-gray-800/50 backdrop-blur-sm p-6 mb-8 border border-gray-700">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">Circuit Implementation</h2>
            <div className="bg-black/30 p-4 rounded-lg mb-4">
              <Image
                src="/images/shors-circuit.jpg"
                alt="Shor's Circuit Diagram"
                width={600}
                height={300}
                className="mx-auto"
              />
            </div>
            <p className="text-gray-300">
              The quantum circuit consists of:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Quantum Fourier Transform (QFT)</li>
              <li>Modular exponentiation</li>
              <li>Inverse QFT</li>
              <li>Measurement and classical post-processing</li>
            </ul>
          </CardContent>
        </Card>

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
                      step === 1 ? "Quantum Fourier Transform" :
                      step === 2 ? "Modular Exponentiation" :
                      "Period Finding"
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
{`# Qiskit implementation of Shor's algorithm
def shors_circuit(n, a):
    """Create quantum circuit for Shor's algorithm."""
    # Calculate required qubits
    n_count = 2 * len(bin(n)[2:])
    
    # Create quantum circuit
    qc = QuantumCircuit(n_count + 4, n_count)
    
    # Initialize input register
    for q in range(n_count):
        qc.h(q)
    
    # Apply controlled unitary operations
    for i in range(n_count):
        controlled_mod_mult(qc, a, 2**i, n, i)
    
    # Apply inverse QFT
    qft_dagger(qc, n_count)
    
    # Measure
    qc.measure(range(n_count), range(n_count))
    
    return qc`}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
