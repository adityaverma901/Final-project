// import { button } from 'framer-motion/client';
// import { Search } from 'lucide-react'
import Link from 'next/link';
import React from 'react'
export default function Navbar() {
  return (
    <nav className="bg-green-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Inner-Voice</div>
        <div className="hidden md:flex space-x-4 font-mono">
        Your safe space to talk, anytime, anywhere
        </div>
        <div className="flex items-center space-x-4">

          <Link href="/auth/signin"> <button className="bg-white text-green-900 px-3 py-1 rounded hover:bg-gray-100">
            Register
    
          </button>
          </Link>
          <Link href="/auth/login">
          <button className="bg-white text-green-900 px-3 py-1 rounded hover:bg-gray-200">
            Login
          </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
