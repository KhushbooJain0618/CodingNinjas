// Path: src/app/careers/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Corrected import for App Router

// The new interface matching the data from the database
interface Opening {
  _id: string; // MongoDB uses _id
  title: string;
  role: string;
}

export default function CareersPage() {
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [loading, setLoading] = useState(true);
  const [interestedIds, setInterestedIds] = useState<string[]>([]);
  const [hasToken, setHasToken] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    setHasToken(!!token);

    // Fetch career openings from the API
    const fetchCareers = async () => {
      try {
        const res = await fetch("/api/admin/careers", { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          setOpenings(data.careers);
        }
      } catch (err) {
        console.error("Failed to fetch careers:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCareers();
  }, []);

  const handleInterested = (opening: Opening) => {
    // We now use the persistent _id from the database
    if (!interestedIds.includes(opening._id)) {
      setInterestedIds([...interestedIds, opening._id]);
      localStorage.setItem("selectedRole", JSON.stringify({
        // We structure the object for the hiring form
        title: opening.title, 
        role: opening.role
      }));
      if (hasToken) {
        router.push("/hiring-form");
      } else {
        router.push("/signin");
      }
    }
  };
  
  // Render loading state while fetching data
  if (loading) {
      return (
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(255, 107, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 107, 0, 0.03) 1px, transparent 1px)`, backgroundSize: '80px 80px' }}></div>
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-orange-500 rounded-full mix-blend-normal filter blur-[140px] opacity-20 "></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-600 rounded-full mix-blend-normal filter blur-[140px] opacity-15" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 px-6 pt-20 pb-24">
        <div className={`max-w-7xl mx-auto text-center transition-all duration-1500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.2] tracking-tight">
              <span className="block text-white">Are you ready to take your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-gradient">career</span>
              </span>
              <span className="block text-white">to the next level?</span>
            </h1>
          </div>
          <div className="mb-8 space-y-2">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              <span className="text-orange-500">Bag an Apprenticeship.</span>
              <span className="text-white"> Escalate your career</span>
            </h2>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-5xl mx-auto leading-relaxed mb-12 font-light">
            At <span className="text-white font-semibold">Coding Ninjas CUIET</span>, we&apos;re committed to helping you learn, grow, and succeed in the tech world. Explore a world of opportunities, gain hands-on experience, and learn from industry experts as you set out on a path to success. Don&apos;t miss out on this chance to bag an apprenticeship and accelerate your career. Apply today and unlock the door to a bright and promising future!
          </p>
          <div className="w-px h-20 bg-gradient-to-b from-orange-500 to-transparent mx-auto"></div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-20">
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

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {openings.map((opening, index) => (
            <div
              key={opening._id}
              className={`group relative bg-zinc-950 border border-zinc-800 hover:border-orange-500 rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-[1.02] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ transitionDelay: `${400 + index * 50}ms` }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:via-orange-500/10 group-hover:to-orange-500/5 transition-all duration-700"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-orange-500/0 group-hover:border-orange-500 rounded-tl-3xl transition-all duration-500"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-orange-500/0 group-hover:border-orange-500 rounded-br-3xl transition-all duration-500"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-4 text-center h-full">
                <h2 className="text-2xl md:text-3xl font-black text-white group-hover:text-orange-500 transition-colors duration-300 tracking-tight mt-4">{opening.title}</h2>
                <p className="text-gray-400 font-medium">{opening.role}</p>
                <div className="flex-grow"></div>
                <div className="w-full h-[1px] bg-zinc-800 group-hover:bg-orange-500/50 transition-all duration-500"></div>
                <button
                  onClick={() => handleInterested(opening)}
                  disabled={interestedIds.includes(opening._id)}
                  className={`mt-4 py-3 px-6 font-semibold rounded-2xl shadow-lg transition-all duration-300 w-full ${interestedIds.includes(opening._id) ? "bg-emerald-500 text-black opacity-100" : "bg-white hover:bg-orange-500 text-black hover:shadow-orange-500/50 hover:scale-[1.02]"} disabled:opacity-50`}
                >
                  {interestedIds.includes(opening._id) ? "Interested ✅" : "I'm Interested"}
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

