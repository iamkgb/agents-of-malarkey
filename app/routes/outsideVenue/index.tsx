import { useNavigate } from "react-router";
import eventConfig from "../../config/eventConfig.json";

const OutsideVenue = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="mb-8">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        {/* Main Message */}
        <h1 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
          You're outside the venue
        </h1>

        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Please visit <strong>Mehrauli Archaeological Park</strong> to
          experience the event.
        </p>

        {/* Venue Information */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-900 mb-2">
            Venue: Mehrauli Archaeological Park
          </h3>
          <p className="text-xs text-green-700">
            Located in South Delhi, near Qutub Minar
          </p>
        </div>

        {/* Event Title */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2
            className="text-lg font-light text-gray-800 leading-tight"
            onClick={() => navigate("/")}
          >
            {eventConfig.event.page.title}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {eventConfig.event.eventDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OutsideVenue;
