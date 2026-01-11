"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ExifReader from "exifreader";
import { uploadToCloudinary } from "./uploadCloudinary";
import { createPotholeReport, processPotholeAI } from "./actions";

const base64ToFile = (base64: string, filename: string, mimeType: string) => {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new File([ab], filename, { type: mimeType });
};

function ReportPotholeUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    description: "",
    severity: "Medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [coordinates, setCoordinates] = useState<
    | {
        lat: number;
        lng: number;
      }
    | { lat: ""; lng: "" }
  >({ lat: "", lng: "" });
  // Handle file selection
  const handleFileSelect = (e: any) => {
    const files: File[] = Array.from(e.target.files);
    addFiles(files);
  };

  // Add files to the upload list
  const addFiles = async (files: File[]) => {
    let extractedCoords: { lat: number; lng: number } | null = null;

    const newFiles = await Promise.all(
      files.map(async (file: File) => {
        try {
          const tags = await ExifReader.load(file);
          // ExifReader returns coordinates as decimal numbers in the 'description' field
          const lat = tags["GPSLatitude"]?.description;
          const lng = tags["GPSLongitude"]?.description;

          if (lat && lng && !extractedCoords) {
            extractedCoords = {
              lat: parseFloat(lat),
              lng: parseFloat(lng),
            };
          }
        } catch (error) {
          console.log("No metadata in:", file.name);
        }

        return {
          file,
          id: Math.random().toString(36).substr(2, 9),
          preview: URL.createObjectURL(file),
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2),
          type: file.type,
        };
      })
    );

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  // Remove file from upload list
  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove: any = prev.find((f: any) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f: any) => f.id !== id);
    });
  };

  // Handle drag and drop
  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files: File[] = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  // Handle form input changes
  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Helper to convert Base64/Blob to File object for Cloudinary
  const urlToFile = async (url: string, filename: string, mimeType: string) => {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return new File([buf], filename, { type: mimeType });
  };

  // Inside ReportPotholeUpload component...

  useEffect(() => {
    const triggerInitialLocationRequest = () => {
      if (!navigator.geolocation) return;

      // This line triggers the browser's "Allow Location" popup
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log("Initial Location Seized");
        },
        (error) => {
          // Log the error but don't break the app
          console.warn("Location permission denied on load:", error.message);
        },
        { enableHighAccuracy: true }
      );
    };

    triggerInitialLocationRequest();
  }, []); // Empty array ensures this only runs ONCE on page load

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) return alert("Please upload an image");
    if (!formData.location.trim()) return alert("Please provide an address");

    setIsSubmitting(true);

    try {
      // 1. UPLOAD FIRST IMAGE TO IMAGE MODEL
      const aiFormData = new FormData();
      aiFormData.append("image", uploadedFiles[0].file);

      const aiResponse = await processPotholeAI(aiFormData);

      let filesForCloudinary = uploadedFiles.map((f) => f.file);

      // 2. APPEND IMAGE RETURNED FROM MODEL (if applicable)
      if (aiResponse.success && aiResponse.processedImage) {
        const aiFile = base64ToFile(
          aiResponse.processedImage,
          "processed_pothole.png",
          "image/png"
        );
        filesForCloudinary.push(aiFile);
      }

      // 3. UPLOAD ALL TO CLOUDINARY
      const uploadPromises = filesForCloudinary.map((file) =>
        uploadToCloudinary(file)
      );
      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults
        .filter((result: any) => result.success)
        .map((result: any) => result.url);

      console.log("coordinates:", coordinates);
      // 4. SAVE TO PRISMA
      const finalReport = {
        address: formData.location,
        lat: coordinates.lat || null,
        lng: coordinates.lng || null,
        description: formData.description,
        severity: formData.severity,
        images: imageUrls,
      };

      await createPotholeReport(finalReport);
      console.log(finalReport);

      setIsSubmitting(false);
      setShowSuccessModal(true);
      // ... (reset logic)
    } catch (error) {
      console.error("Workflow failed:", error);
      alert("An error occurred during processing. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/civilian"
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

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Report a Pothole
          </h1>
          <p className="text-gray-600 text-lg">
            Upload images and provide details about the road issue
          </p>
        </div>

        {/* Instructions Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Tips for Better Reports
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload clear photos from multiple angles</li>
                <li>• Include close-up shots showing damage severity</li>
                <li>• Photos should be well-lit and in focus</li>
                <li>• Accepted formats: JPG, PNG, HEIC (Max 10MB per file)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Upload Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
          {/* Upload Area */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Upload Images *
            </label>

            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center">
                <svg
                  className="w-16 h-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>

                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Drag and drop files here
                </h3>
                <p className="text-gray-500 mb-4">or</p>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <span className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-block">
                    Browse Files
                  </span>
                </label>

                <p className="text-sm text-gray-500 mt-4">
                  Supported formats: JPG, PNG, HEIC (Max 10MB per file)
                </p>
              </div>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Uploaded Files ({uploadedFiles.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedFiles.map((file: any) => (
                    <div key={file.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-12 h-12 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* File Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs">
                        <p className="truncate font-medium">{file.name}</p>
                        <p className="text-gray-300">{file.size} MB</p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg
                          className="w-4 h-4"
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Input */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter the exact location of the pothole"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Severity Selection */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Severity Level *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Low", "Medium", "High"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity: level })}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    formData.severity === level
                      ? level === "High"
                        ? "bg-red-500 text-white"
                        : level === "Medium"
                        ? "bg-orange-500 text-white"
                        : "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Additional Details (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the pothole size, depth, any safety concerns, nearby landmarks, etc."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg transition-colors shadow-lg text-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting Report...
              </>
            ) : (
              <>
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Submit Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Report Submitted!
            </h3>
            <p className="text-gray-600 mb-4">
              Your pothole report has been successfully submitted. You can track
              it in your dashboard.
            </p>
            <div className="text-sm text-gray-500">
              Report ID: RPT-
              {Math.random().toString(36).substr(2, 6).toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPotholeUpload;
