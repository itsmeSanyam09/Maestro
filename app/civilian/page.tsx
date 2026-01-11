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
  aiDimensions: {
    id: string;
    length_cm: string;
    width_cm: string;
    depth_cm: string;
    severity: string;
    reasoning: string | null;
    postId: string;
  } | null;
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

        {/* Complaints Grid */}
        <div>
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

                      {complaint.aiDimensions && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-3">
                          <div className="text-xs font-semibold text-blue-900 mb-2">AI Measurements:</div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className="text-xs text-blue-600">Length</div>
                              <div className="font-mono text-sm font-bold text-blue-900">{complaint.aiDimensions.length_cm} cm</div>
                            </div>
                            <div>
                              <div className="text-xs text-blue-600">Width</div>
                              <div className="font-mono text-sm font-bold text-blue-900">{complaint.aiDimensions.width_cm} cm</div>
                            </div>
                            <div>
                              <div className="text-xs text-blue-600">Depth</div>
                              <div className="font-mono text-sm font-bold text-blue-900">{complaint.aiDimensions.depth_cm} cm</div>
                            </div>
                          </div>
                          {complaint.aiDimensions.reasoning && (
                            <p className="text-xs text-blue-700 italic mt-2 border-t border-blue-200 pt-2">
                              "{complaint.aiDimensions.reasoning}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* <Link
                      href={`/complaints/${complaint.id}`}
                      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-900 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      View Details
                    </Link> */}
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
