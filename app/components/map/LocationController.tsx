import { useState } from "react";
import type { MarkerData, UserLocation } from "./types";

interface LocationControllerProps {
  userLocation: UserLocation | null;
  useMockLocation: boolean;
  mockLocation: UserLocation;
  markers: MarkerData[];
  onUseMockLocationChange: (useMock: boolean) => void;
  onMockLocationChange: (location: UserLocation) => void;
  onUserLocationUpdate: (location: UserLocation) => void;
  onMoveToMarker: (marker: MarkerData) => void;
}

export const LocationController = ({
  userLocation,
  useMockLocation,
  mockLocation,
  markers,
  onUseMockLocationChange,
  onMockLocationChange,
  onUserLocationUpdate,
  onMoveToMarker,
}: LocationControllerProps) => {
  const [showLocationController, setShowLocationController] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 z-[1000]">
      {/* Toggle button */}
      <button
        onClick={() => setShowLocationController(!showLocationController)}
        className="bg-white border border-gray-300 px-3 py-2 rounded-md text-sm shadow-md hover:bg-gray-50 mb-2 block w-full"
      >
        📍 Location Control {showLocationController ? "▼" : "▶"}
      </button>

      {/* Location controller panel */}
      {showLocationController && (
        <div className="bg-white border border-gray-300 rounded-md shadow-lg p-4 max-w-80 max-h-96 overflow-y-auto">
          {/* Location mode toggle */}
          <div className="mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useMockLocation}
                onChange={(e) => onUseMockLocationChange(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Use Mock Location</span>
            </label>
          </div>

          {/* Current location display */}
          <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
            <p className="font-medium">Current Location:</p>
            {userLocation && (
              <>
                <p>Lat: {userLocation.latitude.toFixed(6)}</p>
                <p>Lng: {userLocation.longitude.toFixed(6)}</p>
                {userLocation.accuracy && (
                  <p>Accuracy: ±{Math.round(userLocation.accuracy)}m</p>
                )}
              </>
            )}
          </div>

          {useMockLocation && (
            <>
              {/* Manual coordinate input */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Manual Coordinates</h4>
                <div className="space-y-2">
                  <input
                    type="number"
                    step="0.000001"
                    value={mockLocation.latitude}
                    onChange={(e) =>
                      onMockLocationChange({
                        ...mockLocation,
                        latitude: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Latitude"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                  <input
                    type="number"
                    step="0.000001"
                    value={mockLocation.longitude}
                    onChange={(e) =>
                      onMockLocationChange({
                        ...mockLocation,
                        longitude: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Longitude"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                  <button
                    onClick={() => onUserLocationUpdate(mockLocation)}
                    className="w-full bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                  >
                    Update Location
                  </button>
                </div>
              </div>

              {/* Move to markers */}
              <div>
                <h4 className="text-sm font-medium mb-2">Move to Markers</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {markers.map((marker, index) => (
                    <button
                      key={index}
                      onClick={() => onMoveToMarker(marker)}
                      className="w-full text-left px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded"
                    >
                      🎵 {marker.trackTitle}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
