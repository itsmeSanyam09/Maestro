"use client";
import { useState } from "react";
import Link from "next/link";
import ExifReader from "exifreader";
import { uploadToCloudinary } from "./uploadCloudinary";
import { createPotholeReport, processPotholeAI } from "./actions";

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

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
  
  // New State for Analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number | ""; lng: number | "" }>({ lat: "", lng: "" });

  const handleFileSelect = (e: any) => {
    const files: File[] = Array.from(e.target.files);
    addFiles(files);
  };

  const addFiles = async (files: File[]) => {
    // Reset analysis when new files are added
    setAnalysisData(null); 
    
    let extractedCoords: { lat: number; lng: number } | null = null;
    const newFiles = await Promise.all(
      files.map(async (file: File) => {
        try {
          const tags = await ExifReader.load(file);
          const lat = tags["GPSLatitude"]?.description;
          const lng = tags["GPSLongitude"]?.description;
          if (lat && lng && !extractedCoords) {
            extractedCoords = { lat: parseFloat(lat), lng: parseFloat(lng) };
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
    if (extractedCoords) setCoordinates(extractedCoords);
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setAnalysisData(null); // Reset analysis if file is removed
    setUploadedFiles((prev) => {
      const fileToRemove: any = prev.find((f: any) => f.id === id);
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.preview);
      return prev.filter((f: any) => f.id !== id);
    });
  };

  // --- NEW FEATURE: Analyze Button Handler ---
  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) return alert("Please upload an image first.");
    
    setIsAnalyzing(true);
    setAnalysisData(null);

    try {
      const base64Image = await fileToBase64(uploadedFiles[0].file);
      const res = await fetch("/api/pothole", {
        method: "POST",
        body: JSON.stringify({ imageBase64: base64Image }),
      });
      const json = await res.json();
      
      setAnalysisData(json);
      
      // Optional: Auto-update severity if the AI detects it
      if (json.severity) {
        setFormData(prev => ({...prev, severity: json.severity}));
      }

    } catch (err) {
      console.error(err);
      alert("Error calculating dimensions. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- EXISTING LOGIC: Submit Handler ---
  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) return alert("Please upload an image");
    if (!formData.location.trim()) return alert("Please provide an address");

    setIsSubmitting(true);

    try {
      // 1. Prepare Description
      let finalDescription = formData.description;
      
      // Append Analysis Data if it exists
      if (analysisData && analysisData.dimensions) {
         finalDescription += `\n\n[AI Analysis]\nSeverity: ${analysisData.severity}\nDimensions: ${analysisData.dimensions.length_cm}cm (L) x ${analysisData.dimensions.width_cm}cm (W) x ${analysisData.dimensions.depth_cm}cm (D)\nReasoning: ${analysisData.reasoning}`;
      }

      // 2. Upload to Cloudinary & PotholeAI (Existing Logic)
      const aiFormData = new FormData();
      aiFormData.append("image", uploadedFiles[0].file);
      const aiResponse = await processPotholeAI(aiFormData);

      let filesForCloudinary = uploadedFiles.map((f) => f.file);

      if (aiResponse.success && aiResponse.processedImage) {
        const aiFile = base64ToFile(aiResponse.processedImage, "processed_pothole.png", "image/png");
        filesForCloudinary.push(aiFile);
      }

      const uploadPromises = filesForCloudinary.map((file) => uploadToCloudinary(file));
      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults
        .filter((result: any) => result.success)
        .map((result: any) => result.url);

      // 3. Save to Prisma
      const finalReport = {
        address: formData.location,
        lat: coordinates?.lat || null,
        lng: coordinates?.lng || null,
        description: finalDescription,
        severity: formData.severity,
        images: imageUrls,
      };

      await createPotholeReport(finalReport);

      setIsSubmitting(false);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        setUploadedFiles([]);
        setAnalysisData(null); // Reset analysis
        setCoordinates({ lat: "", lng: "" });
        setFormData({ location: "", description: "", severity: "Medium" });
      }, 3000);

    } catch (error) {
      console.error("Workflow failed:", error);
      alert("An error occurred during processing. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Drag and Drop handlers (kept simple for brevity)
  const handleDragEnter = (e: any) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: any) => { e.preventDefault(); setIsDragging(false); };
  const handleDragOver = (e: any) => { e.preventDefault(); };
  const handleDrop = (e: any) => {
    e.preventDefault(); setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };
  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/civilian" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors">
             &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Report a Pothole</h1>
          <p className="text-gray-600 text-lg">Upload images and analyze damage before submitting.</p>
        </div>

        {/* Main Upload Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
          
          {/* 1. UPLOAD SECTION */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">Upload Images *</label>
            <div
              onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 bg-gray-50"}`}
            >
              <div className="flex flex-col items-center">
                <p className="text-gray-500 mb-4">Drag and drop or</p>
                <label className="cursor-pointer">
                  <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                  <span className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-block">Browse Files</span>
                </label>
              </div>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                 {/* Image Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {uploadedFiles.map((file: any) => (
                    <div key={file.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                        <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                      </div>
                      <button onClick={() => removeFile(file.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                         X
                      </button>
                    </div>
                  ))}
                </div>

                {/* --- ANALYZE BUTTON --- */}
                {!analysisData && (
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors shadow flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? "Analyzing Pothole Dimensions..." : "🔍 Analyze Image with AI"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* --- ANALYSIS RESULTS DISPLAY --- */}
          {analysisData && (
            <div className="mb-8 bg-slate-50 border border-indigo-100 p-5 rounded-xl animate-fade-in-down">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl text-indigo-900">AI Analysis Results</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  analysisData.severity === "High" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {analysisData.severity} Severity
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div className="bg-white p-3 rounded border shadow-sm">
                  <div className="text-gray-400 text-xs uppercase font-bold">Length</div>
                  <div className="font-mono text-xl font-bold text-gray-800">{analysisData.dimensions?.length_cm || "?"} <span className="text-sm text-gray-400">cm</span></div>
                </div>
                <div className="bg-white p-3 rounded border shadow-sm">
                  <div className="text-gray-400 text-xs uppercase font-bold">Width</div>
                  <div className="font-mono text-xl font-bold text-gray-800">{analysisData.dimensions?.width_cm || "?"} <span className="text-sm text-gray-400">cm</span></div>
                </div>
                <div className="bg-white p-3 rounded border border-blue-200 shadow-sm ring-2 ring-blue-50">
                  <div className="text-blue-500 text-xs uppercase font-bold">Depth</div>
                  <div className="font-mono text-xl font-bold text-blue-600">{analysisData.dimensions?.depth_cm || "?"} <span className="text-sm text-blue-300">cm</span></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded border text-gray-600 italic text-sm">
                 "{analysisData.reasoning}"
              </div>
            </div>
          )}

          {/* 2. FORM DETAILS */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3">Severity Level *</label>
            <div className="grid grid-cols-3 gap-3">
              {["Low", "Medium", "High"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity: level })}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    formData.severity === level
                      ? level === "High" ? "bg-red-500 text-white" : level === "Medium" ? "bg-orange-500 text-white" : "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3">Additional Details</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
              rows={4}
            />
          </div>

          {/* 3. FINAL SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg shadow-lg text-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Submitting Report..." : "Submit Final Report"}
          </button>
        </div>
      </div>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-2">Success!</h3>
            <p className="text-gray-600">Report submitted successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPotholeUpload;