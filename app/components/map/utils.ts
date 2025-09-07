import type { MarkerData, UserLocation } from "./types";
import L from "leaflet";

// Mock location for testing (Delhi coordinates within the venue area)
export const MOCK_USER_LOCATION: UserLocation = {
  latitude: 28.5245,
  longitude: 77.1899,
  accuracy: 10,
};

// Set this to true for testing without actual GPS
export const USE_MOCK_LOCATION = false;

// Proximity threshold in meters
export const PROXIMITY_THRESHOLD = 10;

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Check if user is within proximity of a marker
export const isWithinProximity = (
  userLocation: UserLocation | null,
  marker: MarkerData
): boolean => {
  if (!userLocation) return false;
  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    marker.latitude,
    marker.longitude
  );
  return distance <= PROXIMITY_THRESHOLD;
};

export const createClusterCustomIcon = function (cluster: any) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: "marker-cluster-custom",
    iconSize: L.point(40, 40, true),
  });
};

export const createMarkerIcon = (
  iconUrl: MarkerData["iconUrl"],
  isInRange: boolean = false
) => {
  const opacityClass = isInRange
    ? "marker-icon-active"
    : "marker-icon-inactive";
  const glowClass = isInRange ? "marker-glow" : "";

  return L.divIcon({
    className: "marker-container",
    html: `
      <div class="${glowClass}">
        <img class='marker-icon ${opacityClass}' src='${iconUrl}'/>
        ${isInRange ? '<div class="proximity-indicator">🎵</div>' : ""}
      </div>
    `,
    iconSize: [64, 64],
  });
};

// Create user location icon
export const createUserLocationIcon = () => {
  return L.divIcon({
    className: "user-location-marker",
    html: `
      <div class="user-location-container">
        <div class="user-location-dot"></div>
        <div class="user-location-pulse"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};
