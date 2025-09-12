import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, redirect } from "react-router";

import "~/main.css";

// Import components
import Root from "./root";
import LandingPage from "./routes/landingPage";
import Event from "./routes/event";
import BrialleLoader from "~/components/brialle-loader";
import OutsideVenue from "./routes/outsideVenue";
import { isUserInsideVenue } from "./components/map/utils";

// Create browser router
// TODO: Flatten router structure by removing Root wrapper and moving routes to top level
const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    HydrateFallback: BrialleLoader,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: "event/:eventId",
        Component: Event,
        loader: async ({ params }) => {
          // Check if user is inside venue bounds
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
              });
            }
          ).catch(() => null);

          if (position) {
            isUserInsideVenue(position.coords);
            console.log(position.coords);
            const isInsideVenue = isUserInsideVenue(position.coords);

            if (!isInsideVenue) {
              return redirect("/outside-the-venue");
            }
          }
          if (params.eventId !== "agents-of-malarkey") return redirect("/");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return { eventId: params.eventId, timestamp: Date.now() };
        },
      },
      {
        path: "outside-the-venue",
        Component: OutsideVenue,
      },
    ],
  },
]);

// Render app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
