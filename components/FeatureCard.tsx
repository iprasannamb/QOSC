import Link from 'next/link';

interface FeatureCardProps {
  title: string;
  description: string;
  link: string;
}

export default function FeatureCard({ title, description, link }: FeatureCardProps) {
  return (
    <div className="p-6 bg-black bg-opacity-40 backdrop-blur-md rounded-lg shadow-lg border border-gray-500 hover:shadow-2xl transition transform hover:scale-105">
      <h2 className="text-2xl font-semibold mb-2 text-cyan-400">{title}</h2>
      <p className="text-gray-300 mb-4">{description}</p>
      <Link href={link}>
        <span className="text-blue-300 hover:text-blue-500 transition cursor-pointer">Learn More →</span>
      </Link>
    </div>
  );
}
