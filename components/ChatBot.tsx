import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;  // Add unique ID for each message
  text: string;
  isUser: boolean;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
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
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: messageCounter,
        text: "Hello! I'm your local AI assistant. How can I help you today?",
        isUser: false
      }]);
      setMessageCounter(prev => prev + 1);
    }
  }, [isOpen]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
          >
            {/* Robot head shape */}
            <path
              d="M6 13C6 9 9 6 13 6H19C23 6 26 9 26 13V19C26 23 23 26 19 26H13C9 26 6 23 6 19V13Z"
              strokeWidth="2"
              fill="currentColor"
            />
            {/* Antenna */}
            <path
              d="M16 6V3"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="16"
              cy="2"
              r="1"
              fill="currentColor"
            />
            {/* Eyes */}
            <circle
              cx="12"
              cy="16"
              r="2"
              fill="#40E0D0"  // Turquoise color for eyes
            />
            <circle
              cx="20"
              cy="16"
              r="2"
              fill="#40E0D0"  // Turquoise color for eyes
            />
            {/* Side circles (ears) */}
            <circle
              cx="5"
              cy="16"
              r="1.5"
              fill="currentColor"
            />
            <circle
              cx="27"
              cy="16"
              r="1.5"
              fill="currentColor"
            />
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 h-[32rem] flex flex-col">
          <div className="bg-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">Local AI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
                  {message.text}
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
            className="border-t p-4 bg-white"
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
      )}
    </div>
  );
} 