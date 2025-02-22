import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import AnimatedBackground from '../components/AnimatedBackground';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CardSpotlight } from "@/components/ui/card-spotlight";

export default function Home() {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Handle initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFadeIn(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen transition-all duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative">
        <div className="fixed top-0 left-0 right-0 h-screen">
          <AnimatedBackground type="video" />
        </div>
        
        <Navigation isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <Sidebar isOpen={isSidebarOpen} />
        
        <div className={`relative z-10 transition-all duration-300 ${
          isSidebarOpen ? 'ml-72' : 'ml-0'
        }`}>
          {/* Hero Section - Without CardSpotlight */}
          <section id="home" className="min-h-screen flex flex-col items-center justify-center p-8">
            <header className="text-center mb-12">
              <h1 className="flex flex-col items-center">
                <span className="text-8xl font-bold text-white mb-4">
                  XREPO
                </span>
                <span className="text-3xl text-gray-300 mt-4">
                  (Quantum Collaboration Platform)
                </span>
              </h1>
              <p className="text-center text-xl max-w-3xl mx-auto mt-8 text-gray-300 leading-relaxed">
                Revolutionizing quantum computing collaboration through an innovative platform
                that brings together researchers, developers, and enthusiasts.
              </p>
            </header>
          </section>

          <div className="bg-gray-900">
            {/* About Section */}
            <section id="about" className="min-h-screen p-16">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-white mb-8">About X-Repo</h2>
                <Separator className="my-8" />
                <div className="grid md:grid-cols-2 gap-12">
                  <CardSpotlight color="rgba(255, 255, 255, 0.1)">
                    <CardHeader>
                      <CardTitle className="text-white">Our Mission</CardTitle>
                      <CardDescription className="text-gray-400">
                        Advancing quantum computing through collaboration
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-gray-300">
                      <p>
                        X-Repo is a cutting-edge platform designed to accelerate quantum computing research and development through collaborative innovation.
                      </p>
                      <p className="mt-4">
                        Our platform combines version control, real-time collaboration, and quantum circuit simulation in one unified interface.
                      </p>
                    </CardContent>
                  </CardSpotlight>

                  <CardSpotlight color="rgba(255, 255, 255, 0.1)">
                    <CardHeader>
                      <CardTitle className="text-white">Key Features</CardTitle>
                      <CardDescription className="text-gray-400">
                        What sets us apart
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-gray-300 space-y-2">
                        <li>• Quantum Algorithm Repository</li>
                        <li>• Real-time Collaboration Tools</li>
                        <li>• Circuit Design & Simulation</li>
                        <li>• Version Control System</li>
                        <li>• Knowledge Sharing Platform</li>
                      </ul>
                    </CardContent>
                  </CardSpotlight>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="min-h-screen p-16">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-white mb-8">Platform Features</h2>
                <Separator className="my-8" />
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Repository System",
                      description: "Advanced version control specifically designed for quantum algorithms and circuits."
                    },
                    {
                      title: "Circuit Designer",
                      description: "Interactive quantum circuit design interface with real-time simulation capabilities."
                    },
                    {
                      title: "Knowledge Hub",
                      description: "Comprehensive documentation, tutorials, and community-driven resources."
                    }
                  ].map((feature, index) => (
                    <CardSpotlight key={index} color="rgba(255, 255, 255, 0.1)">
                      <CardHeader>
                        <CardTitle className="text-white">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300">{feature.description}</p>
                      </CardContent>
                    </CardSpotlight>
                  ))}
                </div>
              </div>
            </section>

            {/* Community Section */}
            <section id="community" className="min-h-screen bg-black/30 p-16">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-white mb-8">Join Our Community</h2>
                <Separator className="my-8" />
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <CardSpotlight color="rgba(255, 255, 255, 0.1)">
                    <CardHeader>
                      <CardTitle className="text-white">Community Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-gray-300 space-y-4">
                        <li>✓ Collaborate on cutting-edge quantum projects</li>
                        <li>✓ Share knowledge and experiences</li>
                        <li>✓ Participate in community discussions</li>
                        <li>✓ Access exclusive resources and tools</li>
                      </ul>
                    </CardContent>
                  </CardSpotlight>

                  <CardSpotlight color="rgba(255, 255, 255, 0.1)">
                    <CardHeader>
                      <CardTitle className="text-white">Get Started Today</CardTitle>
                      <CardDescription className="text-gray-400">
                        Join our growing community
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">
                        Join our growing community and contribute to the future of quantum computing.
                      </p>
                      <Button 
                        onClick={() => router.push('/signup')}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Join Community
                      </Button>
                    </CardContent>
                  </CardSpotlight>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-black/50 text-gray-300 p-8">
              <div className="max-w-6xl mx-auto text-center">
                <p>© 2024 X-Repo. All rights reserved.</p>
                <p className="mt-2">Advancing Quantum Computing Through Collaboration</p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
