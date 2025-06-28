import React from 'react';
import { GateType, ControlledGateType } from '../lib/quantum/gates';
import { AdvancedGateType } from '../lib/quantum/advanced-gates';

export interface Operation {
  gate: GateType | ControlledGateType | AdvancedGateType;
  target: number;
  control?: number;
  time: number;
  params?: number;
}

interface Props {
  numQubits: number;
  operations: Operation[];
  onGateClick: (operation: Operation) => void;
}

export const QuantumCircuit: React.FC<Props> = ({ numQubits, operations, onGateClick }) => {
  // Group operations by time step
  const timeSteps = operations.reduce((acc, op) => {
    const maxTime = Math.max(...operations.map(o => o.time), 0);
    return Array.from({ length: maxTime + 1 }, (_, i) => 
      operations.filter(op => op.time === i)
    );
  }, [] as Operation[][]);

  return (
    <div className="quantum-circuit bg-[#1C1C1C] p-4 rounded-lg overflow-x-auto">
      {/* Qubit labels */}
      <div className="flex min-w-[800px]">
        <div className="w-16 border-r border-gray-700 flex-shrink-0">
          {Array.from({ length: numQubits }).map((_, i) => (
            <div key={i} className="h-12 flex items-center justify-center text-sm">
              q[{i}]
            </div>
          ))}
        </div>
        
        {/* Circuit grid */}
        <div className="flex-1 relative">
          {/* Horizontal lines */}
          {Array.from({ length: numQubits }).map((_, i) => (
            <div 
              key={i} 
              className="h-12 border-b border-gray-700 flex items-center"
            >
              <div className="absolute left-0 w-full h-[1px] bg-blue-500/30" />
            </div>
          ))}
          
          {/* Gates */}
          {operations.map((op, idx) => (
            <div
              key={idx}
              className="absolute"
              style={{
                left: `${op.time * 60 + 12}px`,
                top: `${op.target * 48 + 6}px`,
              }}
              onClick={() => onGateClick(op)}
            >
              <GateDisplay operation={op} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GateDisplay: React.FC<{ operation: Operation }> = ({ operation }) => {
  const getGateColor = (gate: string) => {
    const colors: Record<string, string> = {
      H: 'bg-purple-600',
      X: 'bg-blue-600',
      Y: 'bg-green-600',
      Z: 'bg-red-600',
      CNOT: 'bg-yellow-600',
      CZ: 'bg-orange-600',
      // Add more gate colors
    };
    return colors[gate] || 'bg-gray-600';
  };

  return (
    <div 
      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity ${getGateColor(operation.gate)}`}
    >
      {operation.gate}
      {operation.params !== undefined && (
        <sub className="text-xs">{operation.params.toFixed(1)}</sub>
      )}
    </div>
  );
}; 
