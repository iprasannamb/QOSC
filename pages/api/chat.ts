import type { NextApiRequest, NextApiResponse } from 'next';

// Configure OpenAI API URL
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: 'OpenAI API key is not configured' });
    }

    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',  // Using GPT-4o-mini model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant specializing in quantum computing and software development.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI Error:', errorData);
      throw new Error(`OpenAI Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I couldn't generate a response.";

    return res.status(200).json({ response: aiResponse });
    
  } catch (error: any) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      message: 'Error communicating with OpenAI service',
      error: error.message 
    });
  }
}
