import Link from 'next/link';
import { useState } from 'react';
import ChatBot from '../components/ChatBot';
interface Article {
  id: number;
  title: string;
  content: string;
  votes: number;
}

export default function Knowledge() {
  const [articles, setArticles] = useState<Article[]>([
    { id: 1, title: "Introduction to Quantum Computing", content: "Quantum computing leverages quantum mechanics...", votes: 10 },
    { id: 2, title: "Qubits and Superposition", content: "A qubit is the fundamental unit of quantum information...", votes: 15 },
    { id: 3, title: "Quantum Entanglement Explained", content: "Entanglement is a phenomenon where particles...", votes: 8 }
  ]);

  const upvoteArticle = (id: number) => {
    setArticles(articles.map(article =>
      article.id === id ? { ...article, votes: article.votes + 1 } : article
    ));
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-r from-black to-gray-900 text-white p-8">
      <header className="text-center text-4xl font-extrabold mb-6">
        Knowledge Sharing System
      </header>
      <p className="text-center text-lg mb-8">
        Learn and contribute to quantum computing knowledge. Upvote helpful content!
      </p>

      {/* Wiki Articles Section */}
      <div className="max-w-4xl mx-auto">
        {articles.map((article) => (
          <div key={article.id} className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
            <p className="text-gray-300 mb-4">{article.content}</p>
            <div className="flex justify-between items-center">
              <button 
                onClick={() => upvoteArticle(article.id)} 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                👍 Upvote ({article.votes})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Back to Home Button */}
      <div className="mt-8 text-center">
        <Link href="/">
          <span className="text-blue-400 hover:underline">← Back to Home</span>
        </Link>
      </div>
    </div>
    <div>
      <ChatBot />
    </div>
    </>
  );
}
