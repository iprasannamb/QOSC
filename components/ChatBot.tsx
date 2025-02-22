import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface Message {
  id: number;  // Add unique ID for each message
  text: string;
  isUser: boolean;
}

interface ChatbotProps {
  onClose: () => void;
}

export default function Chatbot({ onClose }: ChatbotProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageCounter, setMessageCounter] = useState(0);  // Counter for unique IDs

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: messageCounter,
        text: "Hello! I'm your local AI assistant. How can I help you today?",
        isUser: false
      }]);
      setMessageCounter(prev => prev + 1);
    }
  }, [messages]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const addMessage = (text: string, isUser: boolean) => {
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: messageCounter,
        text,
        isUser
      }
    ]);
    setMessageCounter(prev => prev + 1);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message immediately
    addMessage(userMessage, true);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }
      
      // Add AI response
      addMessage(data.response, false);
    } catch (error) {
      console.error('Error:', error);
      addMessage("I apologize, but I'm having trouble processing your request. Please try again.", false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50">
      <div
        ref={chatRef}
        className="fixed bottom-6 right-6 w-96 h-[500px] bg-gray-800 rounded-lg shadow-xl border border-gray-700 flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700 h-[60px] shrink-0">
          <h3 className="font-medium text-lg">Quantum Assistant</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${
                  message.isUser 
                    ? 'ml-auto bg-purple-100' 
                    : 'mr-auto bg-white'
                } rounded-lg p-3 max-w-[80%] break-words shadow-sm text-black`}
              >
                <div className="overflow-auto max-h-[200px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          {isLoading && (
            <div className="mr-auto bg-white rounded-lg p-2 shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form 
          onSubmit={handleSend}
          className="border-t p-4 bg-white h-[70px] shrink-0"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-purple-600 text-black placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`${
                isLoading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
              } text-white rounded-lg px-1 py-2 min-w-[50px] transition-colors duration-200 flex items-center justify-center`}
              disabled={isLoading}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 