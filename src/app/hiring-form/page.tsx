"use client";

import { useState, useEffect } from "react";

interface FormState {
  name: string;
  rollNumber: string;
  contactNumber: string;
  gender: "Male" | "Female" | "Other" | "";
  chitkaraEmail: string;
  department: string;
  group: string;
  specialization: string;
  hosteller: "Hosteller" | "Day Scholar";
  position: string;
  role: string;
  resume: File | null;
}

export default function HiringFormPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    rollNumber: "",
    contactNumber: "",
    gender: "",
    chitkaraEmail: "",
    department: "",
    group: "",
    specialization: "",
    hosteller: "Hosteller",
    position: "",
    role: "",
    resume: null,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user info & prefill, also prefill position & role
  useEffect(() => {
    const selectedRole = localStorage.getItem("selectedRole");
    if (selectedRole) {
      const parsed = JSON.parse(selectedRole);
      setForm((prev) => ({
        ...prev,
        position: parsed.role,
        role: parsed.title,
      }));
    }

    async function fetchUser() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setForm((prev) => ({
              ...prev,
              name: data.user.fullname || "",
              chitkaraEmail: data.user.email || "",
            }));
          } else {
            window.location.href = "/signin";
          }
        } else {
          window.location.href = "/signin";
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        window.location.href = "/signin";
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm((prev) => ({ ...prev, resume: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === "resume" && value instanceof File) {
            formData.append("resume", value);
          } else if (key !== "resume") {
            formData.append(key, value as string);
          }
        }
      });

      const res = await fetch("/api/submitApplication", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Application submitted successfully!");
        setForm((prev) => ({ ...prev, resume: null }));
      } else {
        setMessage(`❌ ${data.error || "Failed to submit application."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong.");
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
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600 rounded-full mix-blend-normal filter blur-[140px] opacity-15"></div>
      </div>

      {/* Form Container */}
      <div className={`relative z-10 w-full max-w-2xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
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
                Hiring Form
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mt-4"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Name (read-only) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  readOnly
                  className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-gray-400 placeholder-gray-600 cursor-not-allowed"
                  required
                />
              </div>

              {/* Chitkara Email (read-only) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Chitkara Mail ID</label>
                <input
                  name="chitkaraEmail"
                  type="email"
                  placeholder="Chitkara Mail ID"
                  value={form.chitkaraEmail}
                  readOnly
                  className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-gray-400 placeholder-gray-600 cursor-not-allowed"
                  required
                />
              </div>

              {/* Roll Number */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Roll Number</label>
                <input
                  name="rollNumber"
                  type="text"
                  placeholder="Roll Number"
                  value={form.rollNumber}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-black border border-zinc-700 focus:border-orange-500 focus:outline-none text-white placeholder-gray-600 transition-all duration-300"
                  required
                />
              </div>

              {/* Contact Number */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Contact Number</label>
                <input
                  name="contactNumber"
                  type="tel"
                  placeholder="Enter your contact number"
                  value={form.contactNumber}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-black border border-zinc-700 focus:border-orange-500 focus:outline-none text-white placeholder-gray-600 transition-all duration-300"
                  required
                  pattern="[0-9]{10}"  
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Gender</label>
                <div className="flex gap-6">
                  {["Male", "Female", "Other"].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={handleChange}
                        className="w-4 h-4 accent-orange-500"
                        required
                      />
                      <span className="text-white">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Department */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Department</label>
                <input
                  name="department"
                  type="text"
                  placeholder="Department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-black border border-zinc-700 focus:border-orange-500 focus:outline-none text-white placeholder-gray-600 transition-all duration-300"
                  required
                />
              </div>

              {/* Group */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Group</label>
                <input
                  name="group"
                  type="text"
                  placeholder="Group"
                  value={form.group}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-black border border-zinc-700 focus:border-orange-500 focus:outline-none text-white placeholder-gray-600 transition-all duration-300"
                  required
                />
              </div>

              {/* Specialization */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Specialization</label>
                <input
                  name="specialization"
                  type="text"
                  placeholder="Specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-black border border-zinc-700 focus:border-orange-500 focus:outline-none text-white placeholder-gray-600 transition-all duration-300"
                  required
                />
              </div>

              {/* Hosteller / Day Scholar */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Accommodation</label>
                <div className="flex gap-6">
                  {["Hosteller", "Day Scholar"].map((h) => (
                    <label key={h} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hosteller"
                        value={h}
                        checked={form.hosteller === h}
                        onChange={handleChange}
                        className="w-4 h-4 accent-orange-500"
                        required
                      />
                      <span className="text-white">{h}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Position (read-only) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Position</label>
                <input
                  name="position"
                  type="text"
                  placeholder="Position"
                  value={form.position}
                  readOnly
                  className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-gray-400 placeholder-gray-600 cursor-not-allowed"
                  required
                />
              </div>

              {/* Role (read-only) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Role</label>
                <input
                  name="role"
                  type="text"
                  placeholder="Role"
                  value={form.role}
                  readOnly
                  className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-gray-400 placeholder-gray-600 cursor-not-allowed"
                  required
                />
              </div>

              {/* Resume Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Resume (PDF, DOC, or DOCX)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full p-4 rounded-xl bg-black border border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500 file:text-black file:font-semibold hover:file:bg-orange-600 file:cursor-pointer transition-all duration-300"
                />
              </div>

              {/* Message */}
              {message && (
                <div className={`p-3 rounded-xl ${message.includes('✅') ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                  <p className={`text-sm font-semibold ${message.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
                    {message}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || loadingUser}
                className="w-full py-4 rounded-xl font-semibold text-black bg-white hover:bg-orange-500 shadow-lg hover:shadow-orange-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>

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