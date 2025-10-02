"use client";

import { useEffect, useState } from "react";

interface Application {
  _id: string;
  name: string;
  chitkaraEmail: string;
  rollNumber: string;
  gender: string;
  department: string;
  group: string;
  specialization: string;
  hosteller: string;
  position: string;
  role: string;
  resumeUrl?: string;
  status: "pending" | "approved";
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
  const [completedApplications, setCompletedApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admin/applications", { cache: "no-store" });
      const data = await res.json();
      setPendingApplications(data.pendingForms);
      setCompletedApplications(data.completedForms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/toggleStatus/${id}`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        fetchApplications(); // refresh lists after status change
      } else {
        console.error("Failed to update status:", data.error);
      }
    } catch (err) {
      console.error("Error updating application status:", err);
    }
  };

  const renderApplication = (app: Application, isPending: boolean) => (
    <div key={app._id} className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-4 hover:border-orange-500/50 transition-all duration-300">
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-orange-500/0 hover:from-orange-500/5 hover:to-orange-500/5 transition-all duration-300"></div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Name</span>
          <span className="text-white font-semibold">{app.name}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Email</span>
          <span className="text-white">{app.chitkaraEmail}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Roll No</span>
          <span className="text-white">{app.rollNumber}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Gender</span>
          <span className="text-white">{app.gender}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Department</span>
          <span className="text-white">{app.department}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Group</span>
          <span className="text-white">{app.group}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Specialization</span>
          <span className="text-white">{app.specialization}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Hosteller</span>
          <span className="text-white">{app.hosteller}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Position</span>
          <span className="text-white">{app.position}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Role</span>
          <span className="text-white">{app.role}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Resume</span>
          {app.resumeUrl ? (
            <a
            href={`/api/resume/${app.resumeUrl.split("/tmp/")[1]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Resume
          </a>
          ) : (
            <span className="text-gray-500">No resume uploaded</span>
          )}
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Status</span>
          <span className={`font-semibold ${app.status === 'approved' ? 'text-green-500' : 'text-yellow-500'}`}>
            {app.status}
          </span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Submitted At</span>
          <span className="text-white text-sm">{new Date(app.createdAt).toLocaleString()}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Last Updated</span>
          <span className="text-white text-sm">{new Date(app.updatedAt).toLocaleString()}</span>
        </div>
      </div>
      
      <button
        onClick={() => toggleStatus(app._id)}
        className={`relative mt-6 w-full md:w-auto py-3 px-6 rounded-xl font-semibold text-black transition-all duration-300 hover:scale-[1.02] shadow-lg ${
          isPending 
            ? "bg-green-500 hover:bg-green-600 hover:shadow-green-500/50" 
            : "bg-yellow-500 hover:bg-yellow-600 hover:shadow-yellow-500/50"
        }`}
      >
        {isPending ? "Approve" : "Move to Pending"}
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading applications...</p>
        </div>
      </div>
    );
  }

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
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-orange-500 rounded-full mix-blend-normal filter blur-[140px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600 rounded-full mix-blend-normal filter blur-[140px] opacity-15"></div>
      </div>

      {/* Content */}
      <div className={`relative z-10 p-6 md:p-8 lg:p-12 transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mt-4"></div>
        </div>

        {/* Pending Applications Section */}
        <section className="mb-12 max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Pending Applications</h2>
            <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-500 text-sm font-semibold">
              {pendingApplications.length}
            </span>
          </div>
          
          {pendingApplications.length === 0 ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center">
              <p className="text-gray-400">No pending applications.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map((app) => renderApplication(app, true))}
            </div>
          )}
        </section>

        {/* Completed Applications Section */}
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Completed Applications</h2>
            <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-500 text-sm font-semibold">
              {completedApplications.length}
            </span>
          </div>
          
          {completedApplications.length === 0 ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center">
              <p className="text-gray-400">No completed applications.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedApplications.map((app) => renderApplication(app, false))}
            </div>
          )}
        </section>

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