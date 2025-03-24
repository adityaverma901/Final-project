import React from 'react'
import Link from 'next/link';
import Navbar from '@/components/navbar';
// import { inter } from '../fonts/fonts'
// import { Search } from 'lucide-react'
// import Navbar from '../components/navbar';
export default function page() {
  return (
    <div className='min-h-screen flex flex-col bg-slate-200'>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-100 text-green  ">
      <header className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Your Mental Health Companion</h1>
        <p className="text-lg">Inner Voice is here for you, providing 24/7 support and guidance to navigate life's challenges.</p>
        <button className="mt-6 px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition">
         <Link href={"./auth/signin"}>  Get Started</Link>
        
        </button>
      </header>

      <section className="bg-white text-gray-800 py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Inner Voice</h2>
          <p className="text-center text-lg mb-6">
            Inner Voice is an AI-powered platform offering a safe, confidential space for your thoughts and feelings.
            Our mission is to provide immediate, empathetic support and help you build coping strategies that contribute
            to long-term well-being.
          </p>
          <p className="text-center text-lg">
            We believe everyone deserves to be heard without judgment. Our state-of-the-art AI technology ensures your privacy
            and provides a tailored experience that fits your needs.
          </p>
        </div>
      </section>

      <section className="bg-gray-200 py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-green-950">Why Choose Inner Voice?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow-md p-6 rounded-lg text-center">
              <h3 className="text-xl text-green-950 font-semibold mb-4">24/7 Availability</h3>
              <p className='text-green-950'>Access support whenever you need it, day or night.</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg text-center">
              <h3 className="text-xl text-green-950 font-semibold mb-4">Secure & Confidential</h3>
              <p className='text-green-950'>Feel safe knowing your conversations are private and encrypted.</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg text-center text-green-950">
              <h3 className="text-xl font-semibold mb-4">Personalized Guidance</h3>
              <p>Receive tailored advice and resources specific to your needs.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
          <blockquote className="italic text-lg text-gray-700">
            "Inner Voice has changed my life. I always have someone to talk to and I feel more in control of my emotions."
            <span className="block mt-4 font-semibold">- Sarah L.</span>
          </blockquote>
        </div>
      </section>
    </div>
    </div>
  );
}
