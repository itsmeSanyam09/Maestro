"use client";
import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "12px",
};

// Hardcoded Shastri Nagar, Delhi Coordinates
const shastriNagar = {
  lat: 28.6692,
  lng: 77.1704,
};

export default function PotholeMap() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={shastriNagar}
      zoom={14} // Zoom level 14 provides a clear view of the neighborhood
    >
      {/* Hardcoded Red Marker */}
      <Marker position={shastriNagar} title="Shastri Nagar Pothole" />
    </GoogleMap>
  ) : (
    <div className="flex items-center justify-center h-[600px] bg-gray-100 rounded-xl">
      <p className="text-gray-500 animate-pulse">Initializing Google Maps...</p>
    </div>
  );
}
