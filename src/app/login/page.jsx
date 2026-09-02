"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingPage from "@/component/Loading/LoadingPage";
import { saveSession, isSessionValid } from "@/lib/authClient";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 5;

const Page = () => {
  const router = useRouter();
  const [showInitialLoading, setShowInitialLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    // Real check: token exists AND hasn't expired — not just a boolean flag
    if (isSessionValid()) {
      router.push("/dashboard");
      return;
    }

    const loadingTimer = setTimeout(() => {
      setShowInitialLoading(false);
      setShowLogin(true);
      setIsAnimating(true);
      const animationTimer = setTimeout(() => setIsAnimating(false), 800);
      return () => clearTimeout(animationTimer);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side brute-force throttle (server should also rate-limit this route)
    if (lockedUntil && Date.now() < lockedUntil) {
      const secondsLeft = Math.ceil((lockedUntil - Date.now()) / 1000);
      setError(`Too many attempts. Try again in ${secondsLeft}s.`);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/superadmin-auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);

        if (nextAttempts >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
          setError(
            `Too many failed attempts. Locked for ${LOCKOUT_MINUTES} minutes.`
          );
        } else {
          setError(data.message || "Invalid email or password.");
        }

        setIsLoading(false);
        return;
      }

      // Success — reset throttle state and persist session
      setAttempts(0);
      saveSession(data.token, data.superAdmin, 12);

      setTimeout(() => {
        setIsLoading(false);
        router.push("/dashboard");
      }, 400);
    } catch (err) {
      console.error("Login request failed:", err);
      setIsLoading(false);
      setError("Something went wrong. Please check your connection and try again.");
    }
  };

  if (showInitialLoading) return <LoadingPage />;
  if (isLoading) return <LoadingPage />;

  const isLocked = lockedUntil && Date.now() < lockedUntil;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 overflow-x-hidden">
      <div className="w-full max-w-md border border-gray-200 bg-white p-6 sm:p-10 rounded-2xl relative">
        <div className="flex justify-center mb-6">
          <div className="w-[60px] h-[60px]">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="text-center mb-6 flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Sign In</h1>
          <p className="text-sm sm:text-md text-gray-400">Hello Boss, Welcome back!</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              disabled={isLocked}
              className="w-full text-base sm:text-xl px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              disabled={isLocked}
              className="w-full text-base sm:text-xl px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className="w-full py-2 px-4 bg-gradient-to-b from-blue-400 to-indigo-500 cursor-pointer outline-none text-white font-semibold rounded-xl text-base sm:text-xl transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
          >
            {isLocked ? "Locked" : "Log In"}
          </button>
        </form>

        <div className="text-center mt-4">
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
            onClick={(e) => {
              e.preventDefault();
              setError("Please contact admin to reset your password.");
            }}
          >
            Don't remember your password?{" "}
            <span className="text-blue-600 hover:underline">Reset</span>
          </a>
        </div>

        <div className="mt-8 pt-6 text-center border-t border-gray-200">
          <div className="font-bold text-gray-800 text-2xl sm:text-3xl">DineEat</div>
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