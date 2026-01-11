"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchAllComplaints, updateComplaintStatus } from "./actions";

interface Complaint {
  id: string;
  reporterName: string;
  image: string;
  status: string;
  location: string;
  longitude: number | null;
  latitude: number | null;
  severity: string;
  dateReported: string;
  description: string | null;
}

function AdminDashboard() {
  // Mock complaints data
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "RPT-001",
      reporterName: "Rajesh Kumar",
      image:
        "https://images.unsplash.com/photo-1625228446534-d54ff2b1f6ab?w=400&h=300&fit=crop",
      status: "Pending",
      location: "MG Road, Connaught Place, New Delhi",
      longitude: 77.2167,
      latitude: 28.6315,
      severity: "High",
      dateReported: "2024-12-28",
      description: "Large pothole causing traffic issues",
    },
    {
      id: "RPT-002",
      reporterName: "Priya Sharma",
      image:
        "https://images.unsplash.com/photo-1621544402532-9f4e1f5d0ca5?w=400&h=300&fit=crop",
      status: "In Progress",
      location: "Sector 18, Noida",
      longitude: 77.391,
      latitude: 28.5708,
      severity: "Medium",
      dateReported: "2024-12-27",
      description: "Multiple small potholes on main road",
    },
    {
      id: "RPT-003",
      reporterName: "Amit Patel",
      image:
        "https://images.unsplash.com/photo-1611857308091-a5e3bc6c4137?w=400&h=300&fit=crop",
      status: "Fixed",
      location: "Rajiv Chowk, Gurgaon",
      longitude: 77.0727,
      latitude: 28.4595,
      severity: "High",
      dateReported: "2024-12-25",
      description: "Deep pothole near traffic signal",
    },
    {
      id: "RPT-004",
      reporterName: "Sneha Reddy",
      image:
        "https://images.unsplash.com/photo-1625228446534-d54ff2b1f6ab?w=400&h=300&fit=crop",
      status: "Pending",
      location: "Lajpat Nagar Market, South Delhi",
      longitude: 77.239,
      latitude: 28.5677,
      severity: "Low",
      dateReported: "2024-12-26",
      description: "Road damage near market entrance",
    },
  ]);

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await fetchAllComplaints();
      if (result.length > 0) {
        setComplaints(result);
      }
      console.log(result);
    };
    fetchPosts();
  }, []);
  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    // 1. Optimistic UI update: Update local state immediately
    const originalComplaints = [...complaints];
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, status: newStatus } : c))
    );

    // 2. Database update
    const result = await updateComplaintStatus(complaintId, newStatus);

    if (!result.success) {
      // 3. Revert if database update fails
      setComplaints(originalComplaints);
      alert("Failed to update status in database.");
    } else {
      console.log(`Successfully updated ${complaintId} to ${newStatus}`);
    }
  };
  const [filters, setFilters] = useState({
    status: "All",
    searchQuery: "",
  });

  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  // Filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    const statusMatch =
      filters.status === "All" || complaint.status === filters.status;

    const searchMatch =
      filters.searchQuery === "" ||
      complaint.id.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      complaint.location
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase()) ||
      complaint.reporterName
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  // Status stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    fixed: complaints.filter((c) => c.status === "Fixed").length,
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "Fixed":
        return "bg-green-100 text-green-800 border-green-300";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Pending":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityColor = (priority: any) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-orange-600";
      case "Low":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Administrator Dashboard
          </h1>
          <p className="text-gray-600">Manage and track all pothole reports</p>
        </div>

        {/* Map Navigation Button */}
        <Link
          href="/admin/map"
          className="absolute top-20 right-10 flex items-center w-[15rem] justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          View Complaint Map
        </Link>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div className="text-3xl font-bold text-gray-800">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Reports</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="text-3xl font-bold text-gray-800">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-600 mt-1">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="text-3xl font-bold text-gray-800">
              {stats.fixed}
            </div>
            <div className="text-sm text-gray-600 mt-1">Fixed</div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by ID, location, or reporter..."
                  value={filters.searchQuery}
                  onChange={(e) =>
                    setFilters({ ...filters, searchQuery: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Fixed">Fixed</option>
              </select>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-1 rounded ${
                    viewMode === "grid" ? "bg-white shadow" : ""
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-1 rounded ${
                    viewMode === "table" ? "bg-white shadow" : ""
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredComplaints.length} of {complaints.length} reports
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={complaint.image}
                    alt={`Pothole at ${complaint.location}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow">
                      {complaint.id}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-3">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {complaint.reporterName}
                      </h3>
                      <span
                        className={`text-xs font-semibold ${getPriorityColor(
                          complaint.severity
                        )}`}
                      >
                        {complaint.severity} Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {complaint.description}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">
                        {complaint.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">
                        {new Date(complaint.dateReported).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <select
                      value={complaint.status}
                      onChange={(e) =>
                        handleStatusChange(complaint.id, e.target.value)
                      }
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Fixed">Fixed</option>
                    </select>
                    <Link
                      href={`admin/complaints/${complaint.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {complaint.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={complaint.image}
                          alt="Pothole"
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {complaint.reporterName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {complaint.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-semibold ${getPriorityColor(
                            complaint.severity
                          )}`}
                        >
                          {complaint.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(complaint.dateReported).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            View
                          </button>
                          <button className="text-green-600 hover:text-green-800 font-medium">
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredComplaints.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-600 text-lg mb-2">No reports found</p>
            <p className="text-gray-500 text-sm">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
