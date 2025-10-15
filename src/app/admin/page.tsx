"use client";

import { useEffect, useState, FormEvent } from "react";

// --- Interfaces ---
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
  status: "pending" | "done";
  createdAt: string;
  updatedAt: string;
}

interface Career {
  _id: string;
  title: string;
  role: string;
}

// --- Helper Components ---
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  itemType,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  itemType: string;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
        <p className="text-gray-400 mb-8">
          Are you unequivocally certain you wish to permanently erase this{" "}
          {itemType}? This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18"></path>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

// --- Main Dashboard Component ---
export default function AdminDashboard() {
  const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
  const [completedApplications, setCompletedApplications] = useState<Application[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "application" | "career";
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newCareerTitle, setNewCareerTitle] = useState("");
  const [newCareerRole, setNewCareerRole] = useState("");
  const [isAddingCareer, setIsAddingCareer] = useState(false);
  const [activeTab, setActiveTab] = useState<'applications' | 'openings'>('applications');

  useEffect(() => {
    setMounted(true);
    Promise.all([fetchApplications(), fetchCareers()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admin/applications", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setPendingApplications(data.pendingForms);

        // Filter completed applications to only show those updated in the last 45 days.
        const now = new Date();
        const fortyFiveDaysInMs = 45 * 24 * 60 * 60 * 1000;
        
        const recentCompletedApplications = data.completedForms.filter(
          (app: Application) => {
            const completedDate = new Date(app.updatedAt);
            return (now.getTime() - completedDate.getTime()) < fortyFiveDaysInMs;
          }
        );

        setCompletedApplications(recentCompletedApplications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCareers = async () => {
    try {
      const res = await fetch("/api/admin/careers", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setCareers(data.careers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCareer = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCareerTitle || !newCareerRole) return;
    setIsAddingCareer(true);
    try {
      const res = await fetch("/api/admin/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newCareerTitle, role: newCareerRole }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCareerTitle("");
        setNewCareerRole("");
        fetchCareers();
      } else {
        console.error("Failed to add career:", data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingCareer(false);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/toggleStatus/${id}`, {
        method: "PATCH",
      });
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

  const openDeleteModal = (id: string, type: "application" | "career") => {
    setItemToDelete({ id, type });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/${itemToDelete.type}s/${itemToDelete.id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        if (itemToDelete.type === "application") {
          fetchApplications();
        } else {
          fetchCareers();
        }
      } else {
        console.error(`Failed to delete ${itemToDelete.type}:`, data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const handleResumeDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename || 'resume';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download resume.");
    }
  };

  const renderTable = (applications: Application[], isPending: boolean) => {
    return (
      <div className="overflow-x-auto bg-zinc-950 border border-zinc-800 rounded-2xl">
        <table className="w-full text-left">
          <thead className="bg-zinc-900 border-b border-zinc-800">
            <tr>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">S.No</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Roll No</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Gender</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Dept</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Group</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Spec.</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Accom.</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Position</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Resume</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Submitted On</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {applications.map((app, index) => {
              const resumeFilename = app.resumeUrl
                ? decodeURIComponent(app.resumeUrl.substring(app.resumeUrl.lastIndexOf("/") + 1))
                : "";
              return (
                <tr key={app._id} className="hover:bg-zinc-900/50 transition-colors duration-200">
                  <td className="px-4 py-4 text-sm text-white font-medium">{index + 1}</td>
                  <td className="px-4 py-4 text-sm text-white font-semibold whitespace-nowrap">{app.name}</td>
                  <td className="px-4 py-4 text-sm text-white whitespace-nowrap">{app.chitkaraEmail}</td>
                  <td className="px-4 py-4 text-sm text-white whitespace-nowrap">{app.contactNumber}</td>
                  <td className="px-4 py-4 text-sm text-white">{app.rollNumber}</td>
                  <td className="px-4 py-4 text-sm text-white whitespace-nowrap">{app.gender}</td>
                  <td className="px-4 py-4 text-sm text-white whitespace-nowrap">{app.department}</td>
                  <td className="px-4 py-4 text-sm text-white whitespace-nowrap">{app.group}</td>
                  <td className="px-4 py-4 text-sm text-white whitespace-nowrap">{app.specialization}</td>
                  <td className="px-4 py-4 text-sm text-white whitespace-nowrap">{app.hosteller}</td>
                  <td className="px-4 py-4 text-sm text-white whitespace-nowrap">{app.position}</td>
                  <td className="px-4 py-4 text-sm text-white whitespace-nowrap">{app.role}</td>
                  <td className="px-4 py-4 text-sm text-white">
                    {app.resumeUrl ? (
                      <button
                        onClick={() => handleResumeDownload(app.resumeUrl!, resumeFilename)}
                        className="text-orange-500 hover:underline bg-transparent border-none p-0 cursor-pointer"
                      >
                        Download
                      </button>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-white whitespace-nowrap">
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4 text-sm text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => toggleStatus(app._id)} className={`py-2 px-4 rounded-lg font-semibold text-black text-xs transition-all duration-300 hover:scale-[1.05] shadow-md cursor-pointer ${isPending ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}`}>
                        {isPending ? "Done" : "Pending"}
                      </button>
                      <button onClick={() => openDeleteModal(app._id, "application")} className="p-2 rounded-lg bg-red-600/20 text-red-500 hover:bg-red-600/30 hover:text-red-400 transition-all duration-200 cursor-pointer" aria-label="Delete application">
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        loading={isDeleting}
        itemType={itemToDelete?.type || ""}
      />
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(255, 107, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 107, 0, 0.03) 1px, transparent 1px)`, backgroundSize: "80px 80px" }}></div>
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-orange-500 rounded-full mix-blend-normal filter blur-[140px] opacity-20"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600 rounded-full mix-blend-normal filter blur-[140px] opacity-15"></div>
        </div>
        <div className={`relative z-10 p-6 md:p-8 lg:p-12 transition-all duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Admin Dashboard</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mt-4"></div>
          </div>

          {/* --- Tab Switcher --- */}
          <div className="mb-10 flex justify-center">
            <div className="relative bg-zinc-900 p-1 rounded-full flex items-center border border-zinc-800">
              <span
                className={`absolute top-1 bottom-1 bg-orange-500 rounded-full shadow-lg shadow-orange-500/20 transition-all duration-300 ease-in-out`}
                style={{
                  width: 'calc(50% - 4px)',
                  transform: activeTab === 'applications' ? 'translateX(4px)' : 'translateX(calc(100% + 4px))',
                }}
              ></span>
              <button
                onClick={() => setActiveTab('applications')}
                className={`relative z-10 w-32 py-2 text-sm font-semibold transition-colors duration-300 rounded-full cursor-pointer ${activeTab === 'applications' ? 'text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Applications
              </button>
              <button
                onClick={() => setActiveTab('openings')}
                className={`relative z-10 w-32 py-2 text-sm font-semibold transition-colors duration-300 rounded-full cursor-pointer ${activeTab === 'openings' ? 'text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Openings
              </button>
            </div>
          </div>

          {/* --- Content Area with Slide Transition --- */}
          <div className="relative w-full overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: activeTab === 'applications' ? 'translateX(0%)' : 'translateX(-100%)' }}
            >
              {/* --- Applications Panel --- */}
              <div className="w-full flex-shrink-0">
                <div className="space-y-12">
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">Pending Applications</h2>
                      <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-500 text-sm font-semibold">{pendingApplications.length}</span>
                    </div>
                    {pendingApplications.length === 0 ? (
                      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center"><p className="text-gray-400">No pending applications.</p></div>
                    ) : (
                      renderTable(pendingApplications, true)
                    )}
                  </section>
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">Completed Applications</h2>
                      <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-500 text-sm font-semibold">{completedApplications.length}</span>
                    </div>
                    {completedApplications.length === 0 ? (
                      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center"><p className="text-gray-400">No completed applications.</p></div>
                    ) : (
                      renderTable(completedApplications, false)
                    )}
                  </section>
                </div>
              </div>

              {/* --- Openings Panel --- */}
              <div className="w-full flex-shrink-0 px-4 md:px-8 lg:px-12">
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center">Manage Career Openings</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sticky top-8">
                        <h3 className="text-lg font-bold text-white mb-4">Add New Opening</h3>
                        <form onSubmit={handleAddCareer} className="flex flex-col items-center gap-4">
                          <input type="text" value={newCareerTitle} onChange={(e) => setNewCareerTitle(e.target.value)} placeholder="Enter Title (e.g., Outreach)" className="w-full p-3 rounded-xl bg-black border border-zinc-700 focus:border-orange-500 focus:outline-none text-white placeholder-gray-600 transition-all duration-300" required />
                          <input type="text" value={newCareerRole} onChange={(e) => setNewCareerRole(e.target.value)} placeholder="Enter Role (e.g., Executive)" className="w-full p-3 rounded-xl bg-black border border-zinc-700 focus:border-orange-500 focus:outline-none text-white placeholder-gray-600 transition-all duration-300" required />
                          <button type="submit" disabled={isAddingCareer} className="w-full flex-shrink-0 py-3 px-6 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                            <PlusIcon /> Add Opening
                          </button>
                        </form>
                      </div>
                    </div>
                    {/* Openings List Section */}
                    <div className="lg:col-span-2">
                      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Current Openings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                          {careers.length > 0 ? (
                            careers.map((career) => (
                              <div key={career._id} className="flex items-center justify-between bg-zinc-900 p-4 rounded-lg">
                                <div>
                                  <p className="font-bold text-white">{career.title}</p>
                                  <p className="text-sm text-gray-400">{career.role}</p>
                                </div>
                                <button onClick={() => openDeleteModal(career._id, "career")} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors duration-200 cursor-pointer">
                                  <TrashIcon />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-gray-500 py-4 col-span-full">No career openings found.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-xs text-gray-600">
              Powered by <span className="font-bold text-orange-500">CN_CUIET</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
