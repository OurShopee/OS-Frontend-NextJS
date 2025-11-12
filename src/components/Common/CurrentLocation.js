"use client";
import React, { useState, useEffect } from "react";
import { useContent } from "@/hooks";

const LocationFetcher = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");

  // Language content
  const addressNotFound = useContent("header.addressNotFound");
  const errorFetchingAddress = useContent("header.errorFetchingAddress");
  const locationAccessDenied = useContent("header.locationAccessDenied");
  const geolocationNotSupported = useContent("header.geolocationNotSupported");
  const fetchingAddress = useContent("header.fetchingAddress");
  const fetchingLocation = useContent("header.fetchingLocation");

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
              setAddress(addressNotFound);
            }
          } catch (error) {
            console.error("Error fetching address:", error);
            setAddress(errorFetchingAddress);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setAddress(locationAccessDenied);
        }
      );
    } else {
      if (typeof window !== "undefined") {
        setAddress(geolocationNotSupported);
      }
    }
  }, []);

  return (
    <div>
      {location ? (
        <div className="currentlocation-address no-underline">
          {address || fetchingAddress}
        </div>
      ) : (
        <div className="currentlocation-address">{fetchingLocation}</div>
      )}
    </div>
  );
};

export default LocationFetcher;
