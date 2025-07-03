// components/CoverageMap.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = defaultIcon;

const FlyToDistrict = ({ position }) => {
  const map = useMap();
  if (position) {
    map.flyTo(position, 10); // Zoom in
  }
  return null;
};

const CoverageMap = ({ districtData }) => {
  const [searchInput, setSearchInput] = useState("");
  const [focusPosition, setFocusPosition] = useState(null);
  const [popupText, setPopupText] = useState(null);

  const handleSearch = () => {
    const input = searchInput.trim().toLowerCase();

    const matched = districtData.find((d) =>
      d.district.toLowerCase().includes(input)
    );

    if (matched) {
      setFocusPosition([matched.latitude, matched.longitude]);
      setPopupText({
        district: matched.district,
        areas: matched.covered_area,
      });
    } else {
      alert("District not found");
    }
  };

  return (
    <div>
      {/* 🔍 Search Box */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search district..."
          className="input input-bordered w-full max-w-sm"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* 🗺️ Map */}
      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow border">
        <MapContainer
          center={[23.685, 90.3563]}
          zoom={7}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Fly to selected district */}
          {focusPosition && <FlyToDistrict position={focusPosition} />}

          {/* Show all markers */}
          {districtData.map((district, index) => (
            <Marker
              key={index}
              position={[district.latitude, district.longitude]}
              icon={defaultIcon}
            >
              <Popup>
                <strong>{district.district}</strong> <br />
                Covered Areas: <br />
                {district.covered_area.join(", ")}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Optional: Show popup info below map */}
      {popupText && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-bold">{popupText.district}</h2>
          <p className="text-gray-700">Areas: {popupText.areas.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default CoverageMap;
