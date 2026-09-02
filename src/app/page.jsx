"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const timerRef = useRef(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogoClick = () => {
    const currentTime = Date.now();
    
    // Reset counter if more than 1 second has passed since last click
    if (currentTime - lastClickTime > 1000) {
      setClickCount(0);
    }
    
    const newCount = clickCount + 1;
    setClickCount(newCount);
    setLastClickTime(currentTime);
    
    // Reset timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Set timer to reset count after 1 second of inactivity
    timerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1000);
    
    // Check if user clicked 6 times
    if (newCount >= 6) {
      // Clear timer and reset count
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setClickCount(0);
      // Navigate to login page
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full p-8 md:p-12 text-center">
        
        {/* Logo with hidden click counter */}
        <div 
          className="flex justify-center mb-8 cursor-pointer"
          onClick={handleLogoClick}
        >
          <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] relative">
            <Image
              src="/logo.png"
              alt="DineEat Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            Welcome to DineEat
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Your ultimate dining experience awaits. Discover our exclusive menu and more!
          </p>
        </div>

        {/* Go to Landing Page Button */}
        <button
          onClick={() => router.push('/landing')}
          className="w-full max-w-md mx-auto py-3 px-6 bg-gradient-to-r from-blue-400 to-indigo-500 cursor-pointer outline-none text-white font-semibold rounded-xl text-lg transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:scale-[1.02]"
        >
          Go to Landing Page
        </button>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            For Your Best! Custom Menu And More.
          </p>
        </div>
      </div>
    </div>
  );
}