"use client";
import React, { useState, useEffect } from "react";

const LocationFetcher = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // Use environment variable for API key - Next.js 14 format
          const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
                API_KEY || "AIzaSyBEhoXegQdZgL1z5vZc4gD0I_Q4MLnnsII"
              }`
            );
            const data = await response.json();
            if (data.results.length > 0) {
              setAddress(data.results[0].formatted_address);
            } else {
              setAddress("Address not found");
            }
          } catch (error) {
            console.error("Error fetching address:", error);
            setAddress("Error fetching address");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setAddress("Location access denied");
        }
      );
    } else {
      if (typeof window !== "undefined") {
        setAddress("Geolocation not supported");
      }
    }
  }, []);

  return (
    <div>
      {location ? (
        <div className="currentlocation-address no-underline">
          {address || "Fetching address..."}
        </div>
      ) : (
        <div className="currentlocation-address">Fetching location...</div>
      )}
    </div>
  );
};

export default LocationFetcher;
