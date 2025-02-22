interface Response {
  text: string;
  keywords: string[];
}

const responses: { [key: string]: Response } = {
  greeting: {
    text: "Hello! How can I help you today?",
    keywords: ["hi", "hello", "hey", "greetings"]
  },
  about: {
    text: "I'm a local AI chatbot designed to help answer questions about this website and its services.",
    keywords: ["who", "what", "about", "yourself"]
  },
  help: {
    text: "I can help you with navigation, provide information about our services, or answer general questions. What would you like to know?",
    keywords: ["help", "assist", "support", "guide"]
  },
  services: {
    text: "Our services include web development, app development, and digital solutions. Would you like specific information about any of these?",
    keywords: ["services", "offer", "provide", "solutions"]
  },
  default: {
    text: "I'm not sure I understand. Could you please rephrase your question?",
    keywords: []
  }
};

export function generateResponse(input: string): string {
  const lowercaseInput = input.toLowerCase();
<<<<<<< HEAD
  
  // Find matching response based on keywords
=======

>>>>>>> 57a263e8ad3c3bc29308e3767c3878f1986c08bf
  for (const [_, response] of Object.entries(responses)) {
    if (response.keywords.some(keyword => lowercaseInput.includes(keyword))) {
      return response.text;
    }
  }
  
  return responses.default.text;
<<<<<<< HEAD
} 
=======
} 
>>>>>>> 57a263e8ad3c3bc29308e3767c3878f1986c08bf
