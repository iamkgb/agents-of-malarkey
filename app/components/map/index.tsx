import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  ZoomControl,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import * as turf from "@turf/turf";

import eventConfig from "../../config/eventConfig.json";
import type { MarkerData, UserLocation } from "./types";
import {
  MOCK_USER_LOCATION,
  USE_MOCK_LOCATION,
  PROXIMITY_THRESHOLD,
  calculateDistance,
  isWithinProximity,
  createClusterCustomIcon,
  createMarkerIcon,
  createUserLocationIcon,
} from "./utils";
import { PersistentAudioPlayer } from "./PersistentAudioPlayer";
import { AudioDrawer } from "./AudioDrawer";
import { LocationController } from "./LocationController";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import "./map.css";

const line = turf.lineString(eventConfig.venue.coords);
const curved = turf.bezierSpline(line, { sharpness: 0 });
const parkPolygon: L.LatLngExpression[] = turf.getCoords(curved);

// Calculate center position from venue coordinates
const venuePolygon = turf.polygon([eventConfig.venue.coords]);
const centerPoint = turf.centroid(venuePolygon);
const centerPosition: [number, number] = [
  centerPoint.geometry.coordinates[0],
  centerPoint.geometry.coordinates[1],
];

// Calculate bounds 1km from center position
const kmToDecimalDegrees = 1 / 111; // Approximately 1 km in decimal degrees
const bounds: L.LatLngBoundsExpression = [
  [
    centerPosition[0] - kmToDecimalDegrees,
    centerPosition[1] - kmToDecimalDegrees,
  ], // Southwest
  [
    centerPosition[0] + kmToDecimalDegrees,
    centerPosition[1] + kmToDecimalDegrees,
  ], // Northeast
];

// Zoom constants
const INITIAL_ZOOM = 18;
const MIN_ZOOM = 16;
const MAX_ZOOM = 22;

const Map = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [mockLocation, setMockLocation] =
    useState<UserLocation>(MOCK_USER_LOCATION);
  const [useMockLocation, setUseMockLocation] = useState(USE_MOCK_LOCATION);
  const [currentPlayingTrack, setCurrentPlayingTrack] =
    useState<MarkerData | null>(null);

  // Initialize markers
  useEffect(() => {
    setMarkers(eventConfig.markerData);
  }, []);

  // User location tracking
  useEffect(() => {
    if (useMockLocation) {
      // Use mock location for testing
      setUserLocation(mockLocation);
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // Cache location for 1 minute
    };

    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      setUserLocation({ latitude, longitude, accuracy });
      setLocationError(null);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      console.error("Geolocation error:", error);
      let errorMessage = "Unable to retrieve your location.";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access denied by user.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out.";
          break;
      }

      setLocationError(errorMessage);
      // Fallback to mock location if geolocation fails
      setUserLocation(mockLocation);
    };

    // Start watching user location
    const id = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      options
    );

    setWatchId(id);

    // Cleanup function
    return () => {
      if (id) {
        navigator.geolocation.clearWatch(id);
      }
    };
  }, [useMockLocation, mockLocation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // Auto-manage current playing track based on proximity
  useEffect(() => {
    if (!userLocation || !markers.length) {
      setCurrentPlayingTrack(null);
      return;
    }

    // Find the first marker the user is within range of
    const nearbyMarker = markers.find((marker) =>
      isWithinProximity(userLocation, marker)
    );

    // Only update if it's different from current track
    if (nearbyMarker && nearbyMarker !== currentPlayingTrack) {
      setCurrentPlayingTrack(nearbyMarker);
    } else if (!nearbyMarker && currentPlayingTrack) {
      // User left proximity of all markers
      setCurrentPlayingTrack(null);
    }
  }, [userLocation, markers, currentPlayingTrack]);

  const handleMarkerClick = (marker: MarkerData) => {
    setSelectedMarker(marker);
    setIsDrawerOpen(true);

    // Optional: Log proximity for debugging
    if (userLocation) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        marker.latitude,
        marker.longitude
      );
      console.log(
        `Clicked marker "${marker.trackTitle}" - Distance: ${Math.round(distance)}m, In range: ${distance <= PROXIMITY_THRESHOLD}`
      );
    }
  };

  // Handle audio player click to open drawer with current track
  const handleAudioPlayerClick = () => {
    if (currentPlayingTrack) {
      setSelectedMarker(currentPlayingTrack);
      setIsDrawerOpen(true);
    }
  };

  // Handle mock location updates
  const updateMockLocation = (lat: number, lng: number) => {
    const newLocation = { latitude: lat, longitude: lng, accuracy: 10 };
    setMockLocation(newLocation);
    if (useMockLocation) {
      setUserLocation(newLocation);
    }
  };

  // Move mock location to a marker position
  const moveToMarker = (marker: MarkerData) => {
    updateMockLocation(marker.latitude, marker.longitude);
  };

  return (
    <>
      {/* Location status indicator */}
      {locationError && (
        <div className="absolute top-4 left-4 z-[1000] bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md text-sm max-w-xs">
          <p className="font-medium">Location Error:</p>
          <p>{locationError}</p>
          {useMockLocation && (
            <p className="mt-1 text-xs">Using mock location for testing.</p>
          )}
        </div>
      )}

      {/* Location Controller */}
      {USE_MOCK_LOCATION && (
        <LocationController
          userLocation={userLocation}
          useMockLocation={useMockLocation}
          mockLocation={mockLocation}
          markers={markers}
          onUseMockLocationChange={setUseMockLocation}
          onMockLocationChange={setMockLocation}
          onUserLocationUpdate={setUserLocation}
          onMoveToMarker={moveToMarker}
        />
      )}

      <div
        className={`transition-all origin-center duration-300 ease-in-out ${
          isDrawerOpen
            ? "transform scale-95 rounded-xl overflow-hidden m-0.5"
            : "transform scale-100 rounded-none overflow-visible m-0"
        }`}
      >
        <MapContainer
          center={centerPosition}
          zoom={INITIAL_ZOOM}
          style={{ height: "100vh", width: "100vw" }}
          maxBounds={bounds}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          zoomAnimation={true}
          zoomSnap={0}
          doubleClickZoom={false}
          boxZoom={false}
          zoomControl={false}
        >
          <ZoomControl position="topright" />
          <TileLayer
            url="https://api.maptiler.com/maps/toner-v2/{z}/{x}/{y}.png?key=6H9UP6dy8s5hlhlY7VE9"
            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
            maxZoom={MAX_ZOOM}
            minZoom={MIN_ZOOM}
            minNativeZoom={18}
            maxNativeZoom={22}
            crossOrigin
          />
          {/* <Polygon
            pathOptions={{
              ...eventConfig.venue.polygonStyle,
              className: "pulsing-polygon",
            }}
            positions={parkPolygon}
          /> */}
          <MarkerClusterGroup
            showCoverageOnHover={false}
            iconCreateFunction={createClusterCustomIcon}
          >
            {markers.map((marker, index) => {
              const isInRange = isWithinProximity(userLocation, marker);
              return (
                <Marker
                  key={index}
                  position={[marker.latitude, marker.longitude]}
                  icon={createMarkerIcon(marker.iconUrl, isInRange)}
                  eventHandlers={{
                    click: () => handleMarkerClick(marker),
                  }}
                />
              );
            })}
          </MarkerClusterGroup>

          {/* User location marker */}
          {userLocation && (
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={createUserLocationIcon()}
              zIndexOffset={1000} // Keep user location on top
            />
          )}
        </MapContainer>
      </div>

      {/* Persistent Audio Player */}
      <PersistentAudioPlayer
        currentTrack={currentPlayingTrack}
        userLocation={userLocation}
        onPlayerClick={handleAudioPlayerClick}
      />

      <AudioDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedMarker={selectedMarker}
        userLocation={userLocation}
      />
    </>
  );
};

export { Map };
