import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavigationProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Navigation({ isOpen, setIsOpen }: NavigationProps) {
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 p-2 hover:bg-gray-800/50 rounded-lg transition-colors z-50"
        aria-label="Toggle Menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className={`h-0.5 w-full bg-white transform transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}></span>
          <span className={`h-0.5 bg-white transform transition-all duration-300 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}></span>
          <span className={`h-0.5 w-full bg-white transform transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}></span>
        </div>
      </button>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-transparent text-white p-4 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 ml-16">
            <Link href="/" className="text-2xl font-bold">
              XREPO
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-lg hover:text-purple-400 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-lg hover:text-purple-400 transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-lg hover:text-purple-400 transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('community')}
              className="text-lg hover:text-purple-400 transition-colors"
            >
              Community
            </button>
            <Link 
              href="/profile" 
              className="text-lg hover:text-purple-400 transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
} 