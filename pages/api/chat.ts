import type { NextApiRequest, NextApiResponse } from 'next';

// Configure Ollama server URL
const OLLAMA_URL = 'http://localhost:11434/api/chat';

// Debug logs
console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
console.log('API Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 5));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Call Ollama server with Mistral model
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',  // Using Mistral model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant powered by the Mistral model.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        stream: false  // Set to false for complete responses
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ollama Error:', errorData);
      throw new Error(`Ollama Error: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.message?.content || data.response || "I couldn't generate a response.";

    return res.status(200).json({ response: aiResponse });
    
  } catch (error: any) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      message: 'Error communicating with Ollama server',
      error: error.message 
    });
  }
}