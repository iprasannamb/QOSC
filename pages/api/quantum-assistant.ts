import type { NextApiRequest, NextApiResponse } from 'next';
import { Operation } from '../../components/QuantumCircuit';

// Configure OpenAI API URL
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

interface QuantumAssistantResponse {
  explanation: string;
  operations: Operation[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt, numQubits } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: 'OpenAI API key is not configured' });
    }

    // Create a system prompt that explains how to format the response
    const systemPrompt = `You are a quantum computing assistant that helps create quantum circuits.
    
When given a description of a quantum circuit, you will:
1. Generate a detailed explanation of the circuit
2. Provide a JSON array of operations to implement the circuit

Each operation should have these properties:
- gate: The quantum gate type (e.g., "H", "X", "CNOT", "CZ", etc.)
- target: The target qubit index (0-based)
- control: (Optional) The control qubit index for controlled gates
- time: The time step for the operation (0-based)

Example operation for a Hadamard gate on qubit 0:
{"gate": "H", "target": 0, "time": 0}

Example operation for a CNOT gate with control qubit 0 and target qubit 1:
{"gate": "CNOT", "control": 0, "target": 1, "time": 1}

The user has ${numQubits} qubits available (indexed 0 to ${numQubits - 1}).
Valid gates include: H, X, Y, Z, S, T, CNOT, CZ, CS, CT

Your response must be valid JSON with this structure:
{
  "explanation": "Detailed explanation of the circuit...",
  "operations": [
    {"gate": "H", "target": 0, "time": 0},
    {"gate": "CNOT", "control": 0, "target": 1, "time": 1},
    ...
  ]
}`;

    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI Error:', errorData);
      throw new Error(`OpenAI Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const aiResponseText = data.choices[0]?.message?.content || "{}";
    
    try {
      // Parse the JSON response
      const parsedResponse: QuantumAssistantResponse = JSON.parse(aiResponseText);
      
      // Validate the operations
      const validatedOperations = parsedResponse.operations.map(op => {
        // Ensure time is a number
        if (typeof op.time !== 'number') {
          op.time = parseInt(op.time as unknown as string) || 0;
        }
        
        // Ensure target is a number
        if (typeof op.target !== 'number') {
          op.target = parseInt(op.target as unknown as string) || 0;
        }
        
        // Ensure control is a number if present
        if (op.control !== undefined && typeof op.control !== 'number') {
          op.control = parseInt(op.control as unknown as string) || 0;
        }
        
        return op;
      });
      
      return res.status(200).json({
        explanation: parsedResponse.explanation || "Generated quantum circuit",
        operations: validatedOperations
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError, aiResponseText);
      return res.status(500).json({ 
        message: 'Failed to parse AI response',
        rawResponse: aiResponseText
      });
    }
  } catch (error: any) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      message: 'Error communicating with OpenAI service',
      error: error.message 
    });
  }
}
