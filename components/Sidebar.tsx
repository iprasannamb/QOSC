import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();

  return (
    <>
      {/* Backdrop - clicking this will also close the sidebar */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-30 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen && setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full w-72 bg-gray-900/95 backdrop-blur-sm text-white 
          p-8 transform transition-all duration-300 ease-in-out shadow-2xl z-40 
          border-r border-gray-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-12">
          {/* Repository Section */}
          <Link 
            href="/Repository" 
            className="block group"
          >
            <div className={`p-4 rounded-xl transition-all duration-200 
              ${router.pathname === '/repository' 
                ? 'bg-purple-600/20 border-purple-500/50' 
                : 'hover:bg-gray-800/50'
              } border border-transparent hover:border-gray-700`}
            >
              <div className="text-xl font-medium group-hover:text-purple-400 transition-colors mb-2">
                Repository
              </div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Quantum Algorithm Collection
              </div>
            </div>
          </Link>

          {/* Playground Section */}
          <Link 
            href="/playground" 
            className="block group"
          >
            <div className={`p-4 rounded-xl transition-all duration-200 
              ${router.pathname === '/playground' 
                ? 'bg-purple-600/20 border-purple-500/50' 
                : 'hover:bg-gray-800/50'
              } border border-transparent hover:border-gray-700`}
            >
              <div className="text-xl font-medium group-hover:text-purple-400 transition-colors mb-2">
                Playground
              </div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Circuit Design & Simulation
              </div>
            </div>
          </Link>

          {/* Knowledge Section */}
          <Link 
            href="/knowledge" 
            className="block group"
          >
            <div className={`p-4 rounded-xl transition-all duration-200 
              ${router.pathname === '/knowledge' 
                ? 'bg-purple-600/20 border-purple-500/50' 
                : 'hover:bg-gray-800/50'
              } border border-transparent hover:border-gray-700`}
            >
              <div className="text-xl font-medium group-hover:text-purple-400 transition-colors mb-2">
                Knowledge
              </div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Community Resources
              </div>
            </div>
          </Link>

          {/* Divider */}
          <div className="border-t border-gray-800 my-5" />
           {/* Footer */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="text-sm text-gray-400 text-center">
              
             
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
