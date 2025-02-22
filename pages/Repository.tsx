import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Repository() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black text-white p-8">
      <header className="text-center text-4xl font-extrabold mb-6">
        Quantum Algorithm Repository
      </header>
      <p className="text-center text-lg mb-8">
        Browse, upload, and collaborate on quantum algorithms with version control.
      </p>

      {/* Upload Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upload Quantum Algorithm</h2>
        <input type="file" className="block w-full text-gray-300 bg-gray-700 p-2 rounded-lg" />
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Upload
        </button>
      </div>

      {/* Algorithm List Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Available Algorithms</h2>
        <ul className="space-y-4">
          <AlgorithmItem 
            name="Quantum Fourier Transform" 
            href="/algorithms/quantum-fourier-transform"
          />
          <AlgorithmItem 
            name="Grover's Search Algorithm" 
            href="/algorithms/grovers-search"
          />
          <AlgorithmItem 
            name="Shor's Factoring Algorithm" 
            href="/algorithms/shors-algorithm"
          />
          <AlgorithmItem 
            name="Variational Quantum Eigensolver (VQE)" 
            href="/algorithms/vqe"
          />
        </ul>
      </div>

      {/* Back to Home Button */}
      <div className="mt-8 text-center">
        <Link href="/">
          <span className="text-blue-400 hover:underline">← Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

function AlgorithmItem({ name, href }: { name: string; href: string }) {
  const router = useRouter();
  
  return (
    <li className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between">
      <span>{name}</span>
      <Link href={href}>
        <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
          View
        </button>
      </Link>
    </li>
  );
}
