"use client"
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
// import { Loader2 } from 'lucide-react';
// import { Role } from '@prisma/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const [user, setUser] = useState()
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const data = { email, password };
    console.log("data", data);
    console.log("frontend", user);


    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      console.log("data", data);

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || 'Login failed');
      }

      // Store the token

      localStorage.setItem('token', responseData.token);
      localStorage.setItem('id', responseData.user.id);
      localStorage.setItem('user', responseData.user.name);
      localStorage.setItem('email', responseData.user.email);
      console.log('User info:', responseData.user);
      console.log('Token:', responseData.token);
      setUser(responseData.user)
      // You might want to store the user data in a context or state management solution
      // For example: setUser(responseData.user);

      // Successful login
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-green-100 flex">
      <div className="flex-1 flex-col bg-white rounded-lg  m-4 flex items-center justify-start">
      <hr className="my-12 border-t border-white w-full max-w-md" />
    {/* <div className="min-h-screen flex  justify-center "> */}
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Login</h2>
          <p className="text-sm text-gray-600 mt-2">
            Enter your credentials to access your account
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form
          className="bg-white p-8 rounded-lg shadow-md space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-950 focus:border-red-950"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-950 focus:border-red-950"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-950 text-white py-2 px-4 rounded-lg hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-950 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                {/* <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Logging in... */}
              </>
            ) : (
              'Login'
            )}
          </button>
          <Link href={"./signin"} className='flex items-center justify-center'>New User?SignUp here</Link>
        </form>
      </div>
    </div>
    <div className="flex-1 rounded-lg m-4 flex items-center justify-center">
      <Image src={"/image.png"} alt={'dgfh'} width={400} height={200}></Image>
      </div>
    </div>
  );
};

export default Login;