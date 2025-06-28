import React from 'react';
import { Button } from "@/components/ui/button";
import MeasurementHistogram from './MeasurementHistogram';

interface MeasurementResultsProps {
  numQubits: number;
  results: { [key: number]: number };
  isProcessing: boolean;
  onMeasure: () => void;
}

const MeasurementResults: React.FC<MeasurementResultsProps> = ({ 
  numQubits, 
  results, 
  isProcessing, 
  onMeasure 
}) => {
  const hasResults = Object.keys(results).length > 0;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl text-gray-100">Measurement</h3>
        <Button 
          onClick={onMeasure}
          disabled={isProcessing}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isProcessing ? 'Processing...' : 'Measure Circuit'}
        </Button>
      </div>

      {hasResults ? (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {Object.entries(results).map(([state, probability]) => (
              <div key={state} className="bg-gray-800 p-3 rounded-lg flex justify-between">
                <span>|{parseInt(state).toString(2).padStart(numQubits, '0')}⟩</span>
                <span>{(probability * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
          
          <MeasurementHistogram results={results} />
        </>
      ) : (
        <div className="text-gray-400 italic">
          No measurements yet. Click "Measure Circuit" to see the quantum state probabilities.
        </div>
      )}
    </div>
  );
};

export default MeasurementResults;