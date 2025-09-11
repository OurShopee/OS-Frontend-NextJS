// components/MapLocationSelector.jsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const defaultCenter = { lat: 25.2048, lng: 55.2708 }; // Dubai default

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
};

function MapLocationSelector({ apiKey, onLocationSelect, initialCoords = defaultCenter }) {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(initialCoords);
  const [center, setCenter] = useState(initialCoords);
  const [zoom, setZoom] = useState(12);
  const [autocomplete, setAutocomplete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const mapRef = useRef();
  const searchBoxRef = useRef();

  const onMapLoad = useCallback((mapInstance) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
    setMarkerPosition(initialCoords);
    setCenter(initialCoords);
  }, [initialCoords]);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
    setMap(null);
  }, []);

  const onAutocompleteLoad = useCallback((autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  }, []);

  const onPlacesChanged = useCallback(() => {
    if (!autocomplete) return;

    const places = autocomplete.getPlaces();
    if (places?.[0]?.geometry?.location) {
      const loc = places[0].geometry.location;
      const newPos = { lat: loc.lat(), lng: loc.lng() };

      setMarkerPosition(newPos);
      setCenter(newPos);
      setZoom(15);

      if (onLocationSelect) onLocationSelect(places[0], newPos);
      if (searchBoxRef.current && places[0].formatted_address) {
        searchBoxRef.current.value = places[0].formatted_address;
        setSearchQuery(places[0].formatted_address);
      }
    }
  }, [autocomplete, onLocationSelect]);

  const onMarkerDragEnd = useCallback((event) => {
    const newPos = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(newPos);
    if (onLocationSelect) onLocationSelect(null, newPos);

    const coordString = `${newPos.lat.toFixed(6)}, ${newPos.lng.toFixed(6)}`;
    if (searchBoxRef.current) {
      searchBoxRef.current.value = coordString;
      setSearchQuery(coordString);
    }
  }, [onLocationSelect]);

  useEffect(() => {
    if (initialCoords && map) {
      setMarkerPosition(initialCoords);
      setCenter(initialCoords);
    }
  }, [initialCoords, map]);

  const handleSearchInputChange = (e) => setSearchQuery(e.target.value);

  if (!apiKey) {
    return (
      <div className="alert alert-danger p-3">
        Error: Google Maps API Key is missing.
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={['places']}
      loadingElement={<div className="text-center p-3">Loading Map...</div>}
      onError={(e) => console.error("Google Maps Load Error:", e)}
    >
      <div>
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={onPlacesChanged}
          options={{ componentRestrictions: { country: 'AE' } }}
        >
          <input
            type="text"
            placeholder="Search your landmark/Location"
            ref={searchBoxRef}
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="form-control mb-3"
            aria-label="Search location"
          />
        </Autocomplete>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          onLoad={onMapLoad}
          onUnmount={onUnmount}
          options={mapOptions}
          onBoundsChanged={() => {
            if (map) {
              const newCenter = map.getCenter();
              const newZoom = map.getZoom();
              if (newCenter) setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
              if (newZoom) setZoom(newZoom);
            }
          }}
        >
          <Marker
            position={markerPosition}
            draggable
            onDragEnd={onMarkerDragEnd}
            title="Selected Location"
          />
        </GoogleMap>
      </div>
    </LoadScript>
  );
}

export default React.memo(MapLocationSelector);
