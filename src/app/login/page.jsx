"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingPage from '@/component/Loading/LoadingPage';

const Page = () => {
  const router = useRouter();
  const [showInitialLoading, setShowInitialLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      router.push('/dashboard');
      return;
    }

    // Show loading page for 2 seconds first
    const loadingTimer = setTimeout(() => {
      setShowInitialLoading(false);
      setShowLogin(true);
      // Start animation immediately when login appears
      setIsAnimating(true);
      
      // End animation after 0.8 seconds
      const animationTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 800);

      return () => clearTimeout(animationTimer);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Get credentials from environment variables
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    // Validate credentials
    if (formData.email === adminEmail && formData.password === adminPassword) {
      // Save login state to localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('adminEmail', formData.email);
      localStorage.setItem('loginTime', new Date().toISOString());
      
      // Simulate slight delay for smooth transition
      setTimeout(() => {
        setIsLoading(false);
        router.push('/dashboard');
      }, 500);
    } else {
      // Invalid credentials
      setTimeout(() => {
        setIsLoading(false);
        setError('Invalid email or password. Please try again.');
      }, 500);
    }
  };

  // Show initial loading page first
  if (showInitialLoading) {
    return <LoadingPage />;
  }

  // Show loading during form submission
  if (isLoading) {
    return <LoadingPage />;
  }

  // Show login page after initial loading
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 overflow-x-hidden">
      <div className="w-full max-w-md border border-gray-200 bg-white p-6 sm:p-10 rounded-2xl relative">
        
        {/* Logo/Icon Section - Fixed Position */}
        <div className="flex justify-center mb-6">
          <div className="w-[60px] h-[60px]">
            <img
              src="/Loading.svg"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Sign In Header */}
        <div className="text-center mb-6 flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Sign In
          </h1>
          <p className="text-sm sm:text-md text-gray-400">
            Hello Boss, Welcome back!
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full text-base sm:text-xl px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full text-base sm:text-xl px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Log In Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-b from-blue-400 to-indigo-500 cursor-pointer outline-none text-white font-semibold rounded-xl text-base sm:text-xl transition-all duration-200 hover:opacity-90 hover:shadow-lg"
          >
            Log In
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-4">
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
            onClick={(e) => {
              e.preventDefault();
              setError('Please contact admin to reset your password.');
            }}
          >
            Don't remember your password?{" "}
            <span className="text-blue-600 hover:underline">
              Reset
            </span>
          </a>
        </div>

        {/* Footer Text */}
        <div className="mt-8 pt-6 text-center border-t border-gray-200">
          <div className="font-bold text-gray-800 text-2xl sm:text-3xl">
            DineEat
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            For Your Best! <br />
            Custom Menu And More.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Page;