"use client"
import { useEffect, useState } from "react";

export default function useCurrentLocation({address_header}) {
    const [location, setLocation] = useState({});
    const [addressData, setAddress] = useState('');


    const getAddress = async (latitude, longitude) => {
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
        } catch (error) {
        }

    }

    useEffect(() => {
        if(address_header == 0){
            handleLocateme()
        }
    }, []);


    const handleLocateme = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    getAddress(latitude, longitude)
                },
                (error) => {
                }
            );
        } else {
        }
    }

    const handleDragEnd = async (event) => {
        const { latLng } = event;
        const newPosition = { lat: latLng.lat(), lng: latLng.lng() };
        getAddress(newPosition.lat, newPosition.lng)
        setLocation(newPosition);
    };


    return { location,setLocation, handleDragEnd, addressData,setAddress,handleLocateme };
}