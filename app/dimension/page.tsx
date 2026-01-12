"use client";

import { useState } from "react";

export default function PotholePage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  // handling dimensions

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      setData(null);
    }
  };

  const calculateDimensions = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const res = await fetch("/api/pothole", {
        method: "POST",
        body: JSON.stringify({ imageBase64: image }),
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      alert("Error calculating dimensions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto space-y-6 font-sans">
      <h1 className="text-2xl font-bold">Pothole Dimension Estimator</h1>
      
      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="block w-full border p-2 rounded"
      />

      {/* Preview */}
      {image && (
        <div className="relative">
          <img src={image} alt="Preview" className="w-full rounded shadow" />
          <button
            onClick={calculateDimensions}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Get Dimensions"}
          </button>
        </div>
      )}

      {/* Results Display */}
      {data && (
        <div className="bg-slate-50 p-4 rounded border space-y-2">
          <div className="flex justify-between items-center">
             <h2 className="font-semibold text-lg">Results</h2>
             <span className="px-2 py-1 bg-yellow-200 text-xs rounded-full uppercase font-bold tracking-wide">
               {data.severity} Severity
             </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center py-2">
            <div className="bg-white p-2 rounded shadow-sm">
              <div className="text-gray-500 text-xs uppercase">Length</div>
              <div className="font-mono font-bold">{data.dimensions?.length_cm || "?"} CM</div>
            </div>
            <div className="bg-white p-2 rounded shadow-sm">
              <div className="text-gray-500 text-xs uppercase">Width</div>
              <div className="font-mono font-bold">{data.dimensions?.width_cm || "?"} CM</div>
            </div>
            <div className="bg-white p-2 rounded shadow-sm ring-1 ring-blue-200">
              <div className="text-blue-500 text-xs uppercase">Depth</div>
              <div className="font-mono font-bold text-blue-700">{data.dimensions?.depth_cm || "?"} CM</div>
            </div>
          </div>

          <p className="text-sm text-gray-600 italic border-t pt-2 mt-2">
            " {data.reasoning} "
          </p>
        </div>
      )}
    </div>
  );
}
