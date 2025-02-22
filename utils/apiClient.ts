import { AI_CONFIG } from './config';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function sendMessage(message: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get response');
    }
<<<<<<< HEAD

=======
>>>>>>> 57a263e8ad3c3bc29308e3767c3878f1986c08bf
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('API Client Error:', error);
    throw error;
  }
<<<<<<< HEAD
} 
=======
} 
>>>>>>> 57a263e8ad3c3bc29308e3767c3878f1986c08bf
