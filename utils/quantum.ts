import { Operation } from '@/types/quantum';

// Convert circuit to QASM format
export function circuitToQASM(operations: Operation[], numQubits: number): string {
  let qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\n\n';
  qasm += `qreg q[${numQubits}];\n`;
  qasm += `creg c[${numQubits}];\n\n`;
  
  // Sort operations by time
  const sortedOps = [...operations].sort((a, b) => a.time - b.time);
  
  // Add gates
  sortedOps.forEach(op => {
    if (op.control !== undefined) {
      // Controlled gate
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
      // Single qubit gate
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

// Export circuit to file
export function exportQASM(operations: Operation[], numQubits: number): void {
  const qasm = circuitToQASM(operations, numQubits);
  const blob = new Blob([qasm], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quantum_circuit.qasm';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}