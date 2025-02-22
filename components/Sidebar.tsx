import Link from 'next/link';
import { useRouter } from 'next/router';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter();

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-30 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full w-72 bg-gray-900/95 backdrop-blur-sm text-white 
          p-8 pt-24 transform transition-all duration-300 ease-in-out shadow-2xl z-40 
          border-r border-gray-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          {/* Repository Section */}
          <Link 
            href="/repository" 
            className={`block group`}
          >
            <div className={`p-4 rounded-xl transition-all duration-200 
              ${router.pathname === '/repository' 
                ? 'bg-purple-600/20 border-purple-500/50' 
                : 'hover:bg-gray-800/50'
              } border border-transparent hover:border-gray-700`}
            >
              <div className="text-xl font-medium group-hover:text-purple-400 transition-colors">
                Repository
              </div>
              <div className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
                Quantum Algorithm Collection
              </div>
            </div>
          </Link>

          {/* Playground Section */}
          <Link 
            href="/playground" 
            className={`block group`}
          >
            <div className={`p-4 rounded-xl transition-all duration-200 
              ${router.pathname === '/playground' 
                ? 'bg-purple-600/20 border-purple-500/50' 
                : 'hover:bg-gray-800/50'
              } border border-transparent hover:border-gray-700`}
            >
              <div className="text-xl font-medium group-hover:text-purple-400 transition-colors">
                Playground
              </div>
              <div className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
                Circuit Design & Simulation
              </div>
            </div>
          </Link>

          {/* Knowledge Section */}
          <Link 
            href="/knowledge" 
            className={`block group`}
          >
            <div className={`p-4 rounded-xl transition-all duration-200 
              ${router.pathname === '/knowledge' 
                ? 'bg-purple-600/20 border-purple-500/50' 
                : 'hover:bg-gray-800/50'
              } border border-transparent hover:border-gray-700`}
            >
              <div className="text-xl font-medium group-hover:text-purple-400 transition-colors">
                Knowledge
              </div>
              <div className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
                Community Resources
              </div>
            </div>
          </Link>

          {/* Divider */}
          <div className="border-t border-gray-800 my-6" />

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-4">
              Quick Links
            </h3>
            <Link 
              href="/documentation" 
              className="block px-4 py-2 text-gray-300 hover:text-purple-400 transition-colors"
            >
              Documentation
            </Link>
            <Link 
              href="/tutorials" 
              className="block px-4 py-2 text-gray-300 hover:text-purple-400 transition-colors"
            >
              Tutorials
            </Link>
            <Link 
              href="/community" 
              className="block px-4 py-2 text-gray-300 hover:text-purple-400 transition-colors"
            >
              Community Forum
            </Link>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="text-sm text-gray-400 text-center">
              <p>XREPO v1.0.0</p>
              <p className="mt-1">Quantum Collaboration Platform</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 