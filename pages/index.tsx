import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FeatureCard from '../components/FeatureCard';
import ChatBot from '../components/ChatBot';

export default function Home() {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    setFadeIn(true);
  }, [router]);

  return (
    <div className={`relative min-h-screen transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative z-10 p-8 flex flex-col items-center">
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              router.push('/login');
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        <header className="text-center text-5xl font-extrabold mb-6 animate-pulse text-white">
          Quantum Collaboration Platform
        </header>
        <p className="text-center text-lg mb-8 max-w-2xl text-white">
          Explore, experiment, and contribute to the future of quantum computing with an immersive and futuristic interface.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
          <FeatureCard 
            title="Quantum Algorithm Repository"
            description="A version-controlled repository tailored for quantum algorithms."
            link="/Repository"
          />
          <FeatureCard 
            title="Quantum Circuit Playground"
            description="Design, simulate, and collaborate on quantum circuits in real-time."
            link="/playground"
          />
          <FeatureCard 
            title="Knowledge Sharing System"
            description="Engage with the community through a wiki, peer reviews, and discussions."
            link="/knowledge"
          />
        </div>
        
      </div>
    </div>
  );
}
