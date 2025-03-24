'use client'
import Navdash from '@/components/nav-dash'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [userid, setUserid] = useState('')

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return "Good Morning"
    if (hour >= 12 && hour < 17) return "Good Afternoon"
    if (hour >= 17 && hour < 22) return "Good Evening"
    return "Good Night"
  }

  useEffect(() => {
    const storeduserid = localStorage.getItem('id')
    const storedUsername = localStorage.getItem('user')
    const storedMail = localStorage.getItem('email')

    if (storedUsername) setUsername(storedUsername)
    if (storedMail) setEmail(storedMail)
    if (storeduserid) setUserid(storeduserid)
  }, [])

  return (
    <>
      <title>Inner</title>
      <meta name="description" content="Your safe space to talk, anytime, anywhere" />
      
      <Navdash />
      
      <section className="flex flex-col md:flex-row items-center bg-green-200 rounded-lg shadow-lg p-8 md:p-12 space-y-8 md:space-y-0 md:space-x-8">
        <div className="flex justify-center">
          <Image
            src="/dash-image.png"
            alt="Two faces illustration"
            width={1500}
            height={300}
            className="rounded-full shadow-lg"
            priority
          />
        </div>
        
        <div className="text-left">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{getGreeting()}, {username}</h1>
          <p className="text-gray-700 mb-6">
            "Welcome to Inner Voice, your safe and confidential space to express yourself freely.
            Our AI-driven chatbot is here to support you 24/7, providing personalized guidance and resources
            to help you navigate life's challenges. Whether you need a listening ear or professional advice,
            we're always here, anytime, anywhere."
          </p>
          <Link href="/chatbot">
            <button className="bg-green-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-800 transition">
              TRY NEW CHAT →
            </button>
          </Link>
        </div>
      </section>
    </>
  )
}