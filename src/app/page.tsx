"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center justify-center px-6">
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 107, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}></div>

        {/* Glowing Blobs */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-orange-500 rounded-full filter blur-[140px] opacity-25 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600 rounded-full filter blur-[160px] opacity-20 animate-[pulse_6s_ease-in-out_infinite]"></div>
      </div>

      {/* Content Container */}
      <div className={`relative z-10 flex flex-col items-center justify-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

        {/* Title / Logo */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 mb-4 text-center leading-tight drop-shadow-[0_2px_12px_rgba(255,107,0,0.6)]">
          CN_CUIET Careers Portal
        </h1>

        {/* Decorative Line */}
        <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-8 rounded-full shadow-lg"></div>

        {/* Subtitle */}
        <p className="text-gray-400 text-center text-base sm:text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          Explore exciting opportunities, apply for jobs, and build your career
          with <span className="font-semibold text-orange-500">Coding Ninjas CUIET</span> 🚀
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <a
            href="/signin"
            className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-orange-500 shadow-lg hover:shadow-orange-500/50 transition-all duration-300 text-center hover:scale-[1.05] transform"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="w-full sm:w-auto border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-xl font-semibold hover:bg-orange-500 hover:text-black shadow-lg hover:shadow-orange-500/50 transition-all duration-300 text-center hover:scale-[1.05] transform"
          >
            Create Account
          </a>
          <a
            href="/careers"
            className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-zinc-800 hover:border-orange-500/50 shadow-lg hover:shadow-orange-500/30 transition-all duration-300 text-center hover:scale-[1.05] transform"
          >
            View Careers
          </a>
        </div>

        {/* Additional Info Cards */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
          {[
            {title: "Career Opportunities", desc: "Browse through various roles and positions" },
            {title: "Easy Application", desc: "Simple and streamlined application process" },
            {title: "Track Progress", desc: "Monitor your application status in real-time" },
          ].map((card, idx) => (
            <div
              key={idx}
              className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.05] transform overflow-hidden group"
            >
              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-xs text-gray-600">
            Powered by <span className="font-bold text-orange-500">CN_CUIET</span>
          </p>
        </div>
      </div>
    </div>
  );
}
