"use client";

import { useEffect, useState } from "react";

interface Application {
  _id: string;
  name: string;
  chitkaraEmail: string;
  rollNumber: string;
  contactNumber: string;
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
        fetchApplications();
      } else {
        console.error("Failed to update status:", data.error);
      }
    } catch (err) {
      console.error("Error updating application status:", err);
    }
  };

  const renderTable = (applications: Application[], isPending: boolean, startIndex: number) => (
    <div className="overflow-x-auto bg-zinc-950 border border-zinc-800 rounded-2xl">
      <table className="w-full text-left">
        <thead className="bg-zinc-900 border-b border-zinc-800">
          <tr>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">S.No</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Roll No</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact No</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Gender</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Group</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Specialization</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Hosteller</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Position</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Resume</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Submitted At</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Updated</th>
            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {applications.map((app, index) => (
            <tr key={app._id} className="hover:bg-zinc-900/50 transition-colors duration-200">
              <td className="px-4 py-4 text-sm text-white font-medium">{startIndex + index + 1}</td>
              <td className="px-4 py-4 text-sm text-white font-semibold whitespace-nowrap">{app.name}</td>
              <td className="px-4 py-4 text-sm text-white whitespace-nowrap">{app.chitkaraEmail}</td>
              <td className="px-4 py-4 text-sm text-white">{app.rollNumber}</td>
              <td className="px-4 py-4 text-sm text-white">{app.contactNumber}</td>
              <td className="px-4 py-4 text-sm text-white">{app.gender}</td>
              <td className="px-4 py-4 text-sm text-white">{app.department}</td>
              <td className="px-4 py-4 text-sm text-white">{app.group}</td>
              <td className="px-4 py-4 text-sm text-white">{app.specialization}</td>
              <td className="px-4 py-4 text-sm text-white">{app.hosteller}</td>
              <td className="px-4 py-4 text-sm text-white">{app.position}</td>
              <td className="px-4 py-4 text-sm text-white">{app.role}</td>
              <td className="px-4 py-4 text-sm">
              {app.resumeUrl ? (
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400 font-semibold underline"
                >
                  View
                </a>
              ) : (
                <span className="text-gray-500">N/A</span>
              )}
            </td>
              <td className="px-4 py-4 text-sm">
                <span className={`font-semibold ${app.status === 'approved' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {app.status}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-white whitespace-nowrap">{new Date(app.createdAt).toLocaleString()}</td>
              <td className="px-4 py-4 text-sm text-white whitespace-nowrap">{new Date(app.updatedAt).toLocaleString()}</td>
              <td className="px-4 py-4 text-sm">
                <button
                  onClick={() => toggleStatus(app._id)}
                  className={`py-2 px-4 rounded-lg font-semibold text-black text-xs transition-all duration-300 hover:scale-[1.05] shadow-md ${
                    isPending 
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                >
                  {isPending ? "Approve" : "Pending"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
        <section className="mb-12">
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
            renderTable(pendingApplications, true, 0)
          )}
        </section>

        {/* Completed Applications Section */}
        <section>
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
            renderTable(completedApplications, false, 0)
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