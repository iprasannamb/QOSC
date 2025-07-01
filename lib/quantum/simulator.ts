export type Complex = {
  real: number;
  imag: number;
};

export type QuantumState = {
  amplitudes: Complex[];
  numQubits: number;
};

export class QuantumSimulator {
  private state: Complex[];
  private numQubits: number;

  constructor(numQubits: number) {
    this.numQubits = numQubits;
    const stateSize = Math.pow(2, numQubits);
    this.state = new Array(stateSize).fill(null).map(() => ({ real: 0, imag: 0 }));
    this.state[0] = { real: 1, imag: 0 }; // Initialize to |0...0⟩
  }

  // Clone method to create a deep copy of the simulator
  public clone(): QuantumSimulator {
    const newSimulator = new QuantumSimulator(this.numQubits);
    newSimulator.state = this.state.map(complex => ({ real: complex.real, imag: complex.imag }));
    return newSimulator;
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
    const newState = new Array(this.state.length).fill(null).map(() => ({ real: 0, imag: 0 }));
    
    for (let i = 0; i < this.state.length; i++) {
      const bit = (i >> targetQubit) & 1;
      const pairIndex = i ^ (1 << targetQubit);
      
      if (bit === 0) {
        // |0⟩ component
        newState[i] = this.add(
          this.multiply(gate[0][0], this.state[i]),
          this.multiply(gate[0][1], this.state[pairIndex])
        );
        
        // |1⟩ component
        newState[pairIndex] = this.add(
          this.multiply(gate[1][0], this.state[i]),
          this.multiply(gate[1][1], this.state[pairIndex])
        );
      }
    }
    
    this.state = newState;
  }

  // Apply controlled gate
  applyControlledGate(gate: Complex[][], controlQubit: number, targetQubit: number): void {
    const newState = new Array(this.state.length).fill(null).map((_, i) => ({ ...this.state[i] }));
    
    for (let i = 0; i < this.state.length; i++) {
      // Only apply gate if control qubit is |1⟩
      if (((i >> controlQubit) & 1) === 1) {
        const pairIndex = i ^ (1 << targetQubit);
        
        // Store original values
        const stateI = { ...newState[i] };
        const statePair = { ...newState[pairIndex] };
        
        // Apply gate
        newState[i] = this.add(
          this.multiply(gate[0][0], stateI),
          this.multiply(gate[0][1], statePair)
        );
        
        newState[pairIndex] = this.add(
          this.multiply(gate[1][0], stateI),
          this.multiply(gate[1][1], statePair)
        );
      }
    }
    
    this.state = newState;
  }

  // Measure a specific qubit
  measure(qubit: number): { result: number; probability: number } {
    let prob0 = 0;
    
    for (let i = 0; i < this.state.length; i++) {
      if (((i >> qubit) & 1) === 0) {
        const amp = this.state[i];
        prob0 += amp.real * amp.real + amp.imag * amp.imag;
      }
    }

    const random = Math.random();
    const result = random < prob0 ? 0 : 1;
    const probability = result === 0 ? prob0 : 1 - prob0;

    // Collapse state
    const newState = new Array(this.state.length).fill(null).map(() => ({ real: 0, imag: 0 }));
    let normFactor = 0;
    
    for (let i = 0; i < this.state.length; i++) {
      if (((i >> qubit) & 1) === result) {
        newState[i] = { ...this.state[i] };
        const amp = this.state[i];
        normFactor += amp.real * amp.real + amp.imag * amp.imag;
      }
    }

    // Normalize
    const norm = Math.sqrt(normFactor);
    this.state = newState.map(amp => ({
      real: amp.real / norm,
      imag: amp.imag / norm
    }));

    return { result, probability };
  }

  // Get state vector
  getState(): Complex[] {
    return this.state.map(amp => ({ ...amp }));
  }

  // Get qubit probabilities
  getProbabilities(): number[] {
    return this.state.map(amp => 
      amp.real * amp.real + amp.imag * amp.imag
    );
  }
}
