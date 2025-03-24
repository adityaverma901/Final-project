// components/SignOutButton.tsx
'use client';

import { useRouter } from 'next/router';
// import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Sign out using next-auth
      await signOut({
        // Redirect to login page after logout
        callbackUrl: '/login',
      });

      // Optional: Clear any local storage items
      localStorage.clear();

      

      // Router push is optional since next-auth handles redirect
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
    >
      Logout
    </button>
  );
}

function signOut(arg0: {
    // Redirect to login page after logout
    callbackUrl: string;
}) {
    throw new Error('Function not implemented.');
}
