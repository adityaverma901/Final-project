'use client';

import { Search, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Component, useState } from 'react';
// import { span } from 'framer-motion/client';
import SignOutButton from './ui/signOutButton';


export default function Navdash() {
  const [active, setActive] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", id: "dashboard",href:"./dashboard" },
    // { label: "Training", id: "training" ,href:""},
    { label: "Resources", id: "resource"  ,href:"./resources"},
    // { label: "Badges", id: "badges" ,href:""},
    { label: "Contact-us", id: "contact" ,href:"./contact-us"},
  
    { label:"Quiz", id: "quiz" ,href:"./quiz"}
  ];

  const dropdownItems = [
    { label: "My Profile", icon: User, href: "./profile" },
    { label: "Settings", icon: Settings, href: "#" },
    { label: "Logout", icon: LogOut, href: "./",Component: SignOutButton}
  ];

  return (
    <nav className="bg-green-950 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">Inner-Voice</div>

        <div className="hidden md:flex space-x-7">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setActive(item.id)}
              className={`relative py-2 transition-colors duration-300 hover:text-gray-300
                ${active === item.id ? "font-semibold" : ""}
                group`}
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-white transform origin-left transition-transform duration-300 ease-out
                  ${active === item.id ? 'scale-x-100' : 'scale-x-0'}
                  group-hover:scale-x-100
                  bg-gradient-to-r from-transparent via-white to-transparent`}
              />
            </a>
          ))}
        </div>

        {/* Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-500 duration-200"
            // aria-expanded={isDropdownOpen}
            // aria-haspopup="true"
          ><User className="w-6 h-6" />
      <span className="sr-only">Toggle user menu</span>
          
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              {dropdownItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function signOut(arg0: {
    // Redirect to login page after logout
    callbackUrl: string;
  }) {
    throw new Error('Function not implemented.');
  }
