"use client";
import { useState } from "react";
import Link from "next/link";

function CivilianComplaintDetail() {
  // Mock complaint data - would come from route params in real app
  const [complaint] = useState({
    id: "RPT-001",
    images: [
      "https://images.unsplash.com/photo-1625228446534-d54ff2b1f6ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621544402532-9f4e1f5d0ca5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611857308091-a5e3bc6c4137?w=800&h=600&fit=crop",
    ],
    status: "In Progress",
    severity: "High",
    location: {
      address: "MG Road, Near Coffee Day, Connaught Place, New Delhi - 110001",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
      coordinates: {
        latitude: 28.6328,
        longitude: 77.2197,
      },
    },
    dateReported: "2024-12-28T10:30:00",
    lastUpdated: "2024-12-30T14:20:00",
    description:
      "Large pothole on main road causing significant traffic disruption. The pothole has been growing larger after recent rains. Multiple vehicles have been damaged. Located near the traffic signal intersection.",
    dimensions: {
      length: 1.8,
      width: 1.2,
      depth: 0.25,
    },
    estimatedCost: 15000,
    assignedTeam: "Municipal Works Department - Zone 3",
    estimatedCompletionDate: "2025-01-10",
    damageType: "Road Surface Damage",
    trafficImpact: "High",
    weatherCondition: "Post-Monsoon",
    nearbyLandmarks: [
      "Coffee Day Cafe",
      "Metro Station Gate 2",
      "State Bank ATM",
    ],
    reporterNotes:
      "This pothole has caused two accidents in the past week. Urgent repair needed.",
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

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

  const getSeverityColor = (severity: any) => {
    switch (severity) {
      case "High":
        return "text-red-600 bg-red-50 border-red-300";
      case "Medium":
        return "text-orange-600 bg-orange-50 border-orange-300";
      case "Low":
        return "text-blue-600 bg-blue-50 border-blue-300";
      default:
        return "text-gray-600 bg-gray-50 border-gray-300";
    }
  };

  const calculateVolume = () => {
    const volume =
      complaint.dimensions.length *
      complaint.dimensions.width *
      complaint.dimensions.depth;
    return volume.toFixed(2);
  };

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const DetailItem = ({
    icon,
    label,
    value,
    highlight = false,
  }: {
    icon: any;
    label: any;
    value: any;
    highlight?: boolean;
  }) => (
    <div
      className={`p-4 rounded-lg border ${
        highlight ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 ${
            highlight ? "text-blue-600" : "text-gray-600"
          }`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`text-sm font-medium mb-1 ${
              highlight ? "text-blue-900" : "text-gray-600"
            }`}
          >
            {label}
          </div>
          <div
            className={`font-semibold ${
              highlight ? "text-blue-900" : "text-gray-900"
            } break-words`}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Report Details
              </h1>
              <p className="text-gray-600">
                Report ID:{" "}
                <span className="font-semibold text-gray-800">
                  {complaint.id}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span
                className={`px-4 py-2 rounded-lg text-sm font-bold border-2 ${getStatusColor(
                  complaint.status
                )}`}
              >
                {complaint.status}
              </span>
              <span
                className={`px-4 py-2 rounded-lg text-sm font-bold border-2 ${getSeverityColor(
                  complaint.severity
                )}`}
              >
                {complaint.severity} Severity
              </span>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={complaint.images[selectedImageIndex]}
                  alt={`Pothole view ${selectedImageIndex + 1}`}
                  className="w-full h-96 object-cover cursor-pointer"
                  onClick={() => setIsImageExpanded(true)}
                />
                <button
                  onClick={() => setIsImageExpanded(true)}
                  className="absolute top-4 right-4 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </button>
              </div>

              {/* Image Thumbnails */}
              {complaint.images.length > 1 && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex gap-3 overflow-x-auto">
                    {complaint.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Click to view • {selectedImageIndex + 1} of{" "}
                    {complaint.images.length}
                  </p>
                </div>
              )}
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-600"
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
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {complaint.description}
              </p>

              {complaint.reporterNotes && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-semibold text-yellow-900 mb-1">
                    Reporter's Note:
                  </p>
                  <p className="text-sm text-yellow-800">
                    {complaint.reporterNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Timeline Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-600"
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
                Timeline
              </h2>

              <div className="space-y-3">
                <DetailItem
                  icon={
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                  label="Date Reported"
                  value={formatDate(complaint.dateReported)}
                  highlight={true}
                />
                {/* <DetailItem
                  icon={
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  }
                  label="Last Updated"
                  value={formatDate(complaint.lastUpdated)}
                /> */}
                <DetailItem
                  icon={
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  }
                  label="Estimated Completion"
                  value={new Date(
                    complaint.estimatedCompletionDate
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                />
              </div>
            </div>

            {/* Maintenance Cost */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Estimated Maintenance Cost
              </h2>
              <div className="text-4xl font-bold mb-2">
                ₹{complaint.estimatedCost.toLocaleString("en-IN")}
              </div>
              <p className="text-orange-100 text-sm">
                Based on current market rates for {calculateVolume()} m³ of
                repair work
              </p>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="space-y-6">
            {/* Location Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-600"
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
                Location Information
              </h2>

              <div className="space-y-3">
                <DetailItem
                  icon={
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  }
                  label="Address"
                  value={complaint.location.address}
                  highlight={true}
                />

                {/* <div className="grid grid-cols-2 gap-3">
                  <DetailItem
                    icon={
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    }
                    label="City"
                    value={complaint.location.city}
                  />
                  <DetailItem
                    icon={
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
                    }
                    label="State"
                    value={complaint.location.state}
                  />
                </div> */}

                <DetailItem
                  icon={
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
                  }
                  label="GPS Coordinates"
                  value={`${complaint.location.coordinates.latitude}° N, ${complaint.location.coordinates.longitude}° E`}
                />
              </div>

              {/* Nearby Landmarks */}
              {complaint.nearbyLandmarks &&
                complaint.nearbyLandmarks.length > 0 && (
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-semibold text-purple-900 mb-2">
                      Nearby Landmarks:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {complaint.nearbyLandmarks.map((landmark, index) => (
                        <span
                          key={index}
                          className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full"
                        >
                          {landmark}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Damage Assessment */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Dimensions & Assessment
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-900">
                    {complaint.dimensions.length}
                  </div>
                  <div className="text-sm text-blue-700 font-medium mt-1">
                    Length (m)
                  </div>
                </div>
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-900">
                    {complaint.dimensions.width}
                  </div>
                  <div className="text-sm text-green-700 font-medium mt-1">
                    Width (m)
                  </div>
                </div>
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-orange-900">
                    {complaint.dimensions.depth}
                  </div>
                  <div className="text-sm text-orange-700 font-medium mt-1">
                    Depth (m)
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-700 font-semibold">
                    Estimated Volume:
                  </span>
                  <span className="text-2xl font-bold text-purple-900">
                    {calculateVolume()} m³
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <DetailItem
                  icon={
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  }
                  label="Damage Type"
                  value={complaint.damageType}
                />
                <DetailItem
                  icon={
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  }
                  label="Traffic Impact"
                  value={complaint.trafficImpact}
                />
                {/* <DetailItem
                  icon={
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
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  }
                  label="Weather Condition"
                  value={complaint.weatherCondition}
                /> */}
              </div>
            </div>

            {/* Assigned Team */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Assigned Team
              </h2>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {complaint.assignedTeam}
                  </div>
                  <div className="text-sm text-gray-600">
                    Working on this report
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Image Modal */}
      {isImageExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
          onClick={() => setIsImageExpanded(false)}
        >
          <div className="relative max-w-6xl w-full">
            <button
              onClick={() => setIsImageExpanded(false)}
              className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-colors z-10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={complaint.images[selectedImageIndex]}
              alt="Expanded pothole view"
              className="w-full h-auto max-h-screen object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CivilianComplaintDetail;
