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
  return (
    <div className="quantum-circuit bg-[#1C1C1C] p-4 rounded-lg">
      {/* Qubit labels */}
      <div className="flex">
        <div className="w-20 border-r border-gray-700">
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
                left: `${op.time * 48}px`,
                top: `${op.target * 48}px`,
              }}
              onClick={() => onGateClick(op)}
            >
              <GateDisplay operation={op} />
            </div>
          ))}
          
          {/* Control lines */}
          {operations
            .filter(op => op.control !== undefined)
            .map((op, idx) => (
              <div
                key={`ctrl-${idx}`}
                className="absolute w-[2px] bg-black"
                style={{
                  left: `${op.time * 48 + 24}px`,
                  top: `${Math.min(op.target, op.control!) * 48 + 24}px`,
                  height: `${Math.abs(op.target - op.control!) * 48}px`
                }}
              />
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