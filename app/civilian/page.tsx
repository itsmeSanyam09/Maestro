"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getUserPosts } from "./actions";

interface Complaint {
  id: string;
  images: string[];
  address: string;
  longitude: number | null;
  latitude: number | null;
  dimension: string[];
  severity: string;
  createdAt: Date;
  userId: string;
  description: string | null;
}
function CivilianDashboard() {
  // Mock complaint data
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getUserPosts();
      if (result.success) {
        setComplaints(result.data);
      }
    };
    fetchPosts();
  }, []);

  // const [filterStatus, setFilterStatus] = useState("All");

  // const getStatusColor = (status: any) => {
  //   switch (status) {
  //     case "Fixed":
  //       return "bg-green-100 text-green-800 border-green-200";
  //     case "In Progress":
  //       return "bg-yellow-100 text-yellow-800 border-yellow-200";
  //     case "Pending":
  //       return "bg-red-100 text-red-800 border-red-200";
  //     default:
  //       return "bg-gray-100 text-gray-800 border-gray-200";
  //   }
  // };

  // const getStatusIcon = (status: any) => {
  //   switch (status) {
  //     case "Fixed":
  //       return (
  //         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
  //           <path
  //             fillRule="evenodd"
  //             d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
  //             clipRule="evenodd"
  //           />
  //         </svg>
  //       );
  //     case "In Progress":
  //       return (
  //         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
  //           <path
  //             fillRule="evenodd"
  //             d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
  //             clipRule="evenodd"
  //           />
  //         </svg>
  //       );
  //     case "Pending":
  //       return (
  //         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
  //           <path
  //             fillRule="evenodd"
  //             d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
  //             clipRule="evenodd"
  //           />
  //         </svg>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  // const filteredComplaints =
  //   filterStatus === "All"
  //     ? complaints
  //     : complaints.filter((c) => c.status === filterStatus);

  // const statusCounts = {
  //   All: complaints.length,
  //   Pending: complaints.filter((c) => c.status === "Pending").length,
  //   "In Progress": complaints.filter((c) => c.status === "In Progress").length,
  //   Fixed: complaints.filter((c) => c.status === "Fixed").length,
  // };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-600">Track and manage your pothole reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-gray-800">
              {complaints.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Reports</div>
          </div>
          {/* <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="text-3xl font-bold text-gray-800">
              {statusCounts.Pending}
            </div>
            <div className="text-sm text-gray-600 mt-1">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="text-3xl font-bold text-gray-800">
              {statusCounts["In Progress"]}
            </div>
            <div className="text-sm text-gray-600 mt-1">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="text-3xl font-bold text-gray-800">
              {statusCounts.Fixed}
            </div>
            <div className="text-sm text-gray-600 mt-1">Fixed</div>
          </div> */}
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Report a New Issue
              </h2>
              <p className="text-gray-600 text-sm">
                Help improve road safety by reporting potholes
              </p>
            </div>
            <Link
              href="/report-pothole"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Report New Pothole
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        {/*<div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {["All", "Pending", "In Progress", "Fixed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-blue-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                
                {status} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div> */}

        {/* Complaints Grid */}
        <div>
          {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {filterStatus === "All" ? "All Reports" : `${filterStatus} Reports`}
          </h2> */}

          {complaints.length === 0 ? (
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
              <p className="text-gray-600 text-lg">
                No reports found for this filter
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={complaint.images[0]}
                      alt="Pothole"
                      className="w-full h-full object-cover"
                    />
                    {/* <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          complaint.status
                        )}`}
                      >
                        {getStatusIcon(complaint.status)}
                        {complaint.status}
                      </span>
                    </div> */}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-800 mb-1 text-lg">
                        Report #{complaint.id}
                      </h3>
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
                          {complaint.address}
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
                          {new Date(complaint.createdAt).toLocaleDateString(
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

                    <Link
                      href={`/complaints/${complaint.id}`}
                      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-900 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CivilianDashboard;
