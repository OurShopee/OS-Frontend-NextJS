"use client";
import { useCallback, useEffect, useState } from "react";

export default function useCurrentLocation({ address_header = 0 } = {}) {
  const [location, setLocation] = useState({});
  const [addressData, setAddress] = useState("");
  const [geoError, setGeoError] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [hasIpPrefill, setHasIpPrefill] = useState(false);

  const getAddress = useCallback(async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      } else {
        setAddress({});
      }
      setGeoError("");
    } catch (error) {
      setGeoError("Unable to fetch address details.");
    }
  }, []);

  const handleLocateme = useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setGeoError("Geolocation is not supported in this browser.");
      return;
    }
    setIsLocating(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lng: longitude };
        setLocation(coords);
        await getAddress(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        setGeoError(
          error?.message || "We could not access your current location."
        );
        setIsLocating(false);
      }
    );
  }, [getAddress]);

  useEffect(() => {
    if (address_header === 0) {
      handleLocateme();
    }
  }, [address_header, handleLocateme]);

  useEffect(() => {
    let isMounted = true;
    const fetchIpLocation = async () => {
      if (hasIpPrefill || (location?.lat && location?.lng)) {
        return;
      }
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) return;
        const data = await response.json();
        if (
          isMounted &&
          data?.latitude !== undefined &&
          data?.longitude !== undefined
        ) {
          const coords = {
            lat: Number(data.latitude),
            lng: Number(data.longitude),
          };
          setLocation(coords);
          await getAddress(coords.lat, coords.lng);
        }
      } catch (error) {
        console.error("Failed to fetch IP geolocation", error);
      } finally {
        if (isMounted) {
          setHasIpPrefill(true);
        }
      }
    };

    fetchIpLocation();
    return () => {
      isMounted = false;
    };
  }, [getAddress, hasIpPrefill, location?.lat, location?.lng]);

  const handleDragEnd = useCallback(
    async (event) => {
      const { latLng } = event;
      const newPosition = { lat: latLng.lat(), lng: latLng.lng() };
      await getAddress(newPosition.lat, newPosition.lng);
      setLocation(newPosition);
    },
    [getAddress]
  );

  return {
    location,
    setLocation,
    handleDragEnd,
    addressData,
    setAddress,
    handleLocateme,
    isLocating,
    geoError,
  };
}
