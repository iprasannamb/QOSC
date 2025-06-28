// Quantum simulator types
export interface QuantumSimulator {
  clone(): QuantumSimulator;
  applyGate(gate: any, qubit: number): void;
  applyControlledGate(gate: any, control: number, target: number): void;
  measure(qubit: number): { result: number; probability: number };
  getProbabilities(): number[];
}

export interface Operation {
  gate: string;
  target: number;
  control?: number;
  time: number;
}

// Mock quantum gates
export const QuantumGates = {
  H: 'Hadamard',
  X: 'Pauli-X',
  Y: 'Pauli-Y',
  Z: 'Pauli-Z',
  S: 'S Gate',
  T: 'T Gate'
};

export const ControlledGates = {
  CNOT: 'X',
  CZ: 'Z',
  CS: 'S',
  CT: 'T'
};

// Mock simulator implementation
    export class MockQuantumSimulator implements QuantumSimulator {
  private numQubits: number;
  private state: number[];

  constructor(numQubits: number) {
    this.numQubits = numQubits;
    this.state = new Array(Math.pow(2, numQubits)).fill(0);
    this.state[0] = 1; // Initialize to |00...0⟩ state
  }

  clone(): QuantumSimulator {
    const clone = new MockQuantumSimulator(this.numQubits);
    clone.state = [...this.state];
    return clone;
  }

  applyGate(gate: any, qubit: number): void {
    // Simple mock implementation
    if (gate === 'H') {
      // Apply Hadamard - puts qubit in superposition
      this.state = this.state.map((_, i) => {
        const bitValue = (i >> qubit) & 1;
        return bitValue === 0 ? 0.5 : 0.5;
      });
    } else if (gate === 'X') {
      // Apply X gate - flips the qubit
      this.state = this.state.map((val, i) => {
        const flippedIndex = i ^ (1 << qubit);
        return this.state[flippedIndex];
      });
    }
    // Other gates would have similar implementations
  }

  applyControlledGate(gate: any, control: number, target: number): void {
    // Simple mock implementation for controlled gates
    this.state = this.state.map((val, i) => {
      const controlBit = (i >> control) & 1;
      if (controlBit === 1) {
        const flippedIndex = i ^ (1 << target);
        return this.state[flippedIndex];
      }
      return val;
    });
  }

  measure(qubit: number): { result: number; probability: number } {
    // Simple mock measurement
    const prob0 = this.state.reduce((sum, val, i) => {
      const bitValue = (i >> qubit) & 1;
      return bitValue === 0 ? sum + val : sum;
    }, 0);
    
    const result = Math.random() < prob0 ? 0 : 1;
    const probability = result === 0 ? prob0 : 1 - prob0;
    
    // Collapse state
    this.state = this.state.map((val, i) => {
      const bitValue = (i >> qubit) & 1;
      return bitValue === result ? val / probability : 0;
    });
    
    return { result, probability };
  }

  getProbabilities(): number[] {
    return this.state.map(val => Math.pow(val, 2));
  }
}