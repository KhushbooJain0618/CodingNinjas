"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@chitkara\.edu\.in$/;
    if (!emailRegex.test(email) && email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      setError("❌ Only @chitkara.edu.in emails are allowed.");
      return;
    }

    if (password.length < 6) {
      setError("❌ Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // Determine endpoint based on email
      const endpoint =
        email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
          ? "/api/admin-signin"
          : "/api/signin";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(`❌ ${data.error || "Login failed"}`);
        return;
      }

      // Redirect based on endpoint
      if (endpoint === "/api/admin-signin") {
        router.push("/admin");
      } else {
        router.push("/hiring-form");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center px-4 py-12">
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 107, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}></div>
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-orange-500 rounded-full mix-blend-normal filter blur-[140px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600 rounded-full mix-blend-normal filter blur-[140px] opacity-15" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Form Container */}
      <div className={`relative z-10 w-full max-w-md md:max-w-lg transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl">
          
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/5 via-orange-500/10 to-orange-500/5"></div>
          
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-orange-500/50 rounded-tl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-orange-500/50 rounded-br-3xl"></div>
          
          <div className="relative z-10">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mt-4"></div>
              <p className="text-gray-400 text-sm mt-4">
                Please enter your credentials to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@chitkara.edu.in"
                  className="w-full p-4 rounded-xl bg-black border border-zinc-700 focus:border-orange-500 focus:outline-none text-white placeholder-gray-600 transition-all duration-300"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-4 rounded-xl bg-black border border-zinc-700 focus:border-orange-500 focus:outline-none text-white placeholder-gray-600 transition-all duration-300"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                  <p className="text-sm font-semibold text-red-500">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-semibold text-black bg-white hover:bg-orange-500 shadow-lg hover:shadow-orange-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <a href="/signup" className="font-semibold text-orange-500 hover:text-orange-400 transition-colors">
                  Sign Up
                </a>
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-600">
                Powered by <span className="font-bold text-orange-500">CN_CUIET</span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}