import { Operation } from '../../components/QuantumCircuit';

/**
 * Converts a quantum circuit to OpenQASM format
 * @param operations Array of quantum operations
 * @param numQubits Number of qubits in the circuit
 * @returns OpenQASM code as a string
 */
export function circuitToQASM(operations: Operation[], numQubits: number): string {
  let qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\n\n';
  
  // Declare quantum and classical registers
  qasm += `qreg q[${numQubits}];\n`;
  qasm += `creg c[${numQubits}];\n\n`;
  
  // Add operations
  operations.forEach(op => {
    if (op.control !== undefined) {
      // Controlled gates
      switch (op.gate) {
        case 'CNOT':
          qasm += `cx q[${op.control}], q[${op.target}];\n`;
          break;
        case 'CZ':
          qasm += `cz q[${op.control}], q[${op.target}];\n`;
          break;
        case 'CS':
          qasm += `cs q[${op.control}], q[${op.target}];\n`;
          break;
        case 'CT':
          qasm += `ct q[${op.control}], q[${op.target}];\n`;
          break;
        default:
          qasm += `// Unsupported controlled gate: ${op.gate}\n`;
      }
    } else {
      // Single qubit gates
      switch (op.gate) {
        case 'H':
          qasm += `h q[${op.target}];\n`;
          break;
        case 'X':
          qasm += `x q[${op.target}];\n`;
          break;
        case 'Y':
          qasm += `y q[${op.target}];\n`;
          break;
        case 'Z':
          qasm += `z q[${op.target}];\n`;
          break;
        case 'S':
          qasm += `s q[${op.target}];\n`;
          break;
        case 'T':
          qasm += `t q[${op.target}];\n`;
          break;
        default:
          qasm += `// Unsupported gate: ${op.gate}\n`;
      }
    }
  });
  
  return qasm;
}