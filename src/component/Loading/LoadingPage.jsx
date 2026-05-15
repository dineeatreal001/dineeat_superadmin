"use client";

import React from "react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center select-none justify-center">
      {/* Animated SVG Container - using Tailwind's built-in animation */}
      <div className="animate-bounce">
        {/* SVG from public folder */}
        <img 
          src="/Loading.svg" 
          alt="Loading" 
          width={100} 
          height={100}
        />
      </div>

    </div>
  );
}