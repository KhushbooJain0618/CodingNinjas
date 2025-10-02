"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Opening {
  id: number;
  title: string;
  role: string;
  icon: string;
}

const openings: Opening[] = [
  { id: 1, title: "Outreach", role: "Executive", icon: "envelope" },
  { id: 2, title: "Apprentice", role: "Head", icon: "play" },
  { id: 3, title: "Social Media", role: "Executive", icon: "thumb-up" },
  { id: 4, title: "Graphics", role: "Executive", icon: "code" },
  { id: 5, title: "Content", role: "Executive", icon: "location-marker" },
  { id: 6, title: "Logistics", role: "Executive", icon: "user" },
  { id: 7, title: "HR", role: "Executive", icon: "user" },
  { id: 8, title: "Technical", role: "Executive", icon: "code" },
  { id: 9, title: "Events", role: "Executive", icon: "calendar" },
  { id: 10, title: "Media", role: "Executive", icon: "video" },
  { id: 11, title: "Marketing", role: "Executive", icon: "megaphone" },
];


export default function CareersPage() {
  const [interestedIds, setInterestedIds] = useState<number[]>([]);
  const [hasToken, setHasToken] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    setHasToken(!!token);
  }, []);

  const handleInterested = (opening: Opening) => {
    if (!interestedIds.includes(opening.id)) {
      setInterestedIds([...interestedIds, opening.id]);
      localStorage.setItem("selectedRole", JSON.stringify(opening));
      if (hasToken) {
        router.push("/hiring-form");
      } else {
        router.push("/signin");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 107, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}></div>
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-orange-500 rounded-full mix-blend-normal filter blur-[140px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-600 rounded-full mix-blend-normal filter blur-[140px] opacity-15" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 px-6 pt-20 pb-24">
        <div className={`max-w-7xl mx-auto text-center transition-all duration-1500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          
          {/* Main Headline */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.2] tracking-tight">
              <span className="block text-white">Are you ready to take your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-gradient">
                  career
                </span>
              </span>
              <span className="block text-white">to the next level?</span>
            </h1>
          </div>
          
          {/* Subheading */}
          <div className="mb-8 space-y-2">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              <span className="text-orange-500">Bag an Apprenticeship.</span>
              <span className="text-white"> Escalate your career</span>
            </h2>
          </div>
          
          {/* Description */}
         <p className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-5xl mx-auto leading-relaxed mb-12 font-light">
  At <span className="text-white font-semibold">Coding Ninjas CUIET</span>, we&apos;re committed to helping you learn, grow, and succeed in the tech world. Explore a world of opportunities, gain hands-on experience, and learn from industry experts as you set out on a path to success. Don&apos;t miss out on this chance to bag an apprenticeship and accelerate your career. Apply today and unlock the door to a bright and promising future!
</p>

          
          {/* Scroll Indicator Line */}
          <div className="w-px h-20 bg-gradient-to-b from-orange-500 to-transparent mx-auto"></div>
        </div>
      </div>

      {/* Openings Section */}
      <div className="relative z-10 px-6 py-20">
        
        {/* Section Header */}
        <div className={`max-w-7xl mx-auto mb-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: '300ms' }}>
          <div className="flex items-center gap-8 mb-4">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-orange-500/80"></div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-center">
              <span className="text-white">Join Us</span>
            </h1>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-orange-500/50 to-orange-500/80"></div>
          </div>
          <p className="text-center text-gray-400 text-xl mt-4">Current Openings</p>
        </div>

        {/* Job Cards Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {openings.map((opening, index) => (
            <div
              key={opening.id}
              className={`group relative bg-zinc-950 border border-zinc-800 hover:border-orange-500 rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-[1.02] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ 
                transitionDelay: `${400 + index * 50}ms`,
              }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:via-orange-500/10 group-hover:to-orange-500/5 transition-all duration-700"></div>
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-orange-500/0 group-hover:border-orange-500 rounded-tl-3xl transition-all duration-500"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-orange-500/0 group-hover:border-orange-500 rounded-br-3xl transition-all duration-500"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-4 text-center h-full">
                
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-black text-white group-hover:text-orange-500 transition-colors duration-300 tracking-tight mt-4">
                  {opening.title}
                </h2>
                
                {/* Role */}
                <p className="text-gray-400 font-medium">{opening.role}</p>
                
                {/* Spacer */}
                <div className="flex-grow"></div>
                
                {/* Divider */}
                <div className="w-full h-[1px] bg-zinc-800 group-hover:bg-orange-500/50 transition-all duration-500"></div>
                
                {/* Button */}
                <button
                  onClick={() => handleInterested(opening)}
                  disabled={interestedIds.includes(opening.id)}
                  className={`mt-4 py-3 px-6 font-semibold rounded-2xl shadow-lg transition-all duration-300 w-full ${
                    interestedIds.includes(opening.id)
                      ? "bg-emerald-500 text-black opacity-100"
                      : "bg-white hover:bg-orange-500 text-black hover:shadow-orange-500/50 hover:scale-[1.02]"
                  } disabled:opacity-50`}
                >
                  {interestedIds.includes(opening.id)
                    ? "Interested ✅"
                    : "I'm Interested"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}