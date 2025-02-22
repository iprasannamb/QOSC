export type Complex = {
  real: number;
  imag: number;
};

export type QuantumState = {
  amplitudes: Complex[];
  numQubits: number;
};

export class QuantumSimulator {
  private state: QuantumState;

  constructor(numQubits: number) {
    // Initialize state vector with 2^n amplitudes
    const size = Math.pow(2, numQubits);
    this.state = {
      amplitudes: Array(size).fill({ real: 0, imag: 0 }),
      numQubits
    };
    // Set initial state to |0...0⟩
    this.state.amplitudes[0] = { real: 1, imag: 0 };
  }

  // Complex number operations
  private multiply(a: Complex, b: Complex): Complex {
    return {
      real: a.real * b.real - a.imag * b.imag,
      imag: a.real * b.imag + a.imag * b.real
    };
  }

  private add(a: Complex, b: Complex): Complex {
    return {
      real: a.real + b.real,
      imag: a.imag + b.imag
    };
  }

  // Apply single-qubit gate
  applyGate(gate: Complex[][], targetQubit: number): void {
    const n = this.state.numQubits;
    const newAmplitudes = Array(this.state.amplitudes.length)
      .fill({ real: 0, imag: 0 });

    for (let i = 0; i < this.state.amplitudes.length; i++) {
      const bit = (i >> targetQubit) & 1;
      const pair = i & ~(1 << targetQubit);
      
      if (bit === 0) {
        newAmplitudes[i] = this.add(
          this.multiply(gate[0][0], this.state.amplitudes[i]),
          this.multiply(gate[0][1], this.state.amplitudes[i | (1 << targetQubit)])
        );
      }
    }

    this.state.amplitudes = newAmplitudes;
  }

  // Apply controlled gate
  applyControlledGate(
    gate: Complex[][],
    controlQubit: number,
    targetQubit: number
  ): void {
    const newAmplitudes = [...this.state.amplitudes];

    for (let i = 0; i < this.state.amplitudes.length; i++) {
      if (((i >> controlQubit) & 1) === 1) {
        const bit = (i >> targetQubit) & 1;
        const pair = i & ~(1 << targetQubit);
        
        if (bit === 0) {
          const j = i | (1 << targetQubit);
          const temp = newAmplitudes[i];
          newAmplitudes[i] = this.multiply(gate[0][0], this.state.amplitudes[i]);
          newAmplitudes[j] = this.multiply(gate[1][0], temp);
        }
      }
    }

    this.state.amplitudes = newAmplitudes;
  }

  // Measure a specific qubit
  measure(qubit: number): { result: number; probability: number } {
    let prob0 = 0;
    
    for (let i = 0; i < this.state.amplitudes.length; i++) {
      if (((i >> qubit) & 1) === 0) {
        const amp = this.state.amplitudes[i];
        prob0 += amp.real * amp.real + amp.imag * amp.imag;
      }
    }

    const random = Math.random();
    const result = random < prob0 ? 0 : 1;
    const probability = result === 0 ? prob0 : 1 - prob0;

    // Collapse state
    const newAmplitudes = Array(this.state.amplitudes.length)
      .fill({ real: 0, imag: 0 });
    
    for (let i = 0; i < this.state.amplitudes.length; i++) {
      if (((i >> qubit) & 1) === result) {
        newAmplitudes[i] = this.state.amplitudes[i];
      }
    }

    // Normalize
    const norm = Math.sqrt(probability);
    this.state.amplitudes = newAmplitudes.map(amp => ({
      real: amp.real / norm,
      imag: amp.imag / norm
    }));

    return { result, probability };
  }

  // Get state vector
  getState(): Complex[] {
    return [...this.state.amplitudes];
  }

  // Get qubit probabilities
  getProbabilities(): number[] {
    return this.state.amplitudes.map(amp => 
      amp.real * amp.real + amp.imag * amp.imag
    );
  }
} 