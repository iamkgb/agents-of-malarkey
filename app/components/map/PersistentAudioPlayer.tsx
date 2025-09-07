import type { MarkerData, UserLocation } from "./types";
import { isWithinProximity } from "./utils";

interface PersistentAudioPlayerProps {
  currentTrack: MarkerData | null;
  userLocation: UserLocation | null;
  onPlayerClick: () => void;
}

export const PersistentAudioPlayer = ({
  currentTrack,
  userLocation,
  onPlayerClick,
}: PersistentAudioPlayerProps) => {
  if (!currentTrack || !userLocation) return null;

  const isInRange = isWithinProximity(userLocation, currentTrack);
  if (!isInRange) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9998] bg-white border border-gray-300 rounded-2xl shadow-lg persistent-audio-player">
      <div className="flex items-center p-3 space-x-3 main-content">
        {/* Track info container */}
        <div className="flex items-center justify-between space-x-3 track-info-container w-full">
          {/* Track artwork/icon */}

          <div className="flex-shrink-0">
            <img
              src={currentTrack.iconUrl}
              alt={currentTrack.trackTitle}
              className="w-12 h-12 rounded-lg object-cover"
            />
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentTrack.trackTitle}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentTrack.artistName}
            </p>
          </div>
          {/* Info icon button */}
          <button
            onClick={onPlayerClick}
            className="flex-shrink-0 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center transition-colors details-button"
            title="Track Details"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>

        {/* Audio player */}
        <div className="flex-1 max-w-xs audio-container">
          <audio
            controls
            src={currentTrack.audioUrl}
            className="w-full h-8"
            autoPlay
            style={{ height: "32px" }}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </div>
  );
};
