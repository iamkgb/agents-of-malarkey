import { Drawer } from "vaul";
import type { MarkerData, UserLocation } from "./types";
import {
  calculateDistance,
  isWithinProximity,
  PROXIMITY_THRESHOLD,
} from "./utils";

interface DrawerContentProps {
  selectedMarker: MarkerData | null;
  userLocation: UserLocation | null;
}

export const DrawerContent = ({
  selectedMarker,
  userLocation,
}: DrawerContentProps) => {
  if (!selectedMarker) return null;

  const isInRange = isWithinProximity(userLocation, selectedMarker);
  const distance = userLocation
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        selectedMarker.latitude,
        selectedMarker.longitude
      )
    : null;

  return (
    <div className="max-w-md mx-auto">
      <Drawer.Title className="font-medium mb-4 text-2xl text-black">
        {selectedMarker.trackTitle}
      </Drawer.Title>
      <p className="text-gray-600 mb-6 text-lg">
        By {selectedMarker.artistName}
      </p>

      {/* Proximity status */}
      <div
        className={`mb-4 p-3 rounded-lg ${isInRange ? "bg-green-100 border border-green-300" : "bg-orange-100 border border-orange-300"}`}
      >
        <div className="flex items-center space-x-2">
          <div>
            <p
              className={`font-medium ${isInRange ? "text-green-800" : "text-orange-800"}`}
            >
              {isInRange ? "You are within range!" : "Come closer to listen"}
            </p>
            {distance ? (
              <p
                className={`text-sm ${isInRange ? "text-green-600" : "text-orange-600"}`}
              >
                Distance: {Math.round(distance)}m{" "}
                {!isInRange && `(need to be within ${PROXIMITY_THRESHOLD}m)`}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Audio status message */}
      {/* {isInRange ? (
        <div className="mb-6 p-4 bg-green-50 rounded-lg text-center">
          <p className="text-green-700 mb-2">🎵 Audio is now playing below!</p>
          <p className="text-sm text-green-600">
            The audio player will remain visible even when you close this
            drawer.
          </p>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-600 mb-2">
            🎵 Audio available when you get closer
          </p>
          <p className="text-sm text-gray-500">
            Move within {PROXIMITY_THRESHOLD} meters of this location to unlock
            the audio experience
          </p>
        </div>
      )} */}
    </div>
  );
};
