"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const locations = [
  { latitude: 28.6139, longitude: 77.209, label: "Connaught Place" },
  { latitude: 28.5244, longitude: 77.1855, label: "Mehrauli" },
  { latitude: 28.65, longitude: 77.23, label: "Old Delhi" },
  { latitude: 28.545, longitude: 77.273, label: "Okhla" },
  { latitude: 28.63, longitude: 77.11, label: "Janakpuri" },
];

export default function DelhiMapPage() {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <APIProvider apiKey={API_KEY}>
        <Map
          // Centered on New Delhi
          defaultCenter={{ lat: 28.6139, lng: 77.209 }}
          defaultZoom={11}
          gestureHandling={"greedy"}
          disableDefaultUI={false}
        >
          {locations.map((point, index) => (
            <Marker
              key={index}
              position={{ lat: point.latitude, lng: point.longitude }}
              title={point.label}
            />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
