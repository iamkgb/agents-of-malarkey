/**
 * Type definitions for the event configuration
 */

// Core coordinate type for venue boundaries
export type CoordinateArray = [number, number][];

// Polygon style configuration for venue boundaries
export interface PolygonStyle {
  color?: string;
  fillOpacity?: number;
  weight?: number;
  opacity?: number;
  fillColor?: string;
}

// Page configuration for landing page display
export interface PageConfig {
  title?: string;
  heroImage?: string;
  description?: string;
  buttonTitle?: string;
}

// Event metadata and information
export interface EventConfig {
  id: string; // Required - needed for event identification
  eventName: string; // Required - needed for event display
  eventDescription?: string;
  page?: PageConfig;
}

// Venue configuration with coordinates and styling
export interface VenueConfig {
  coords: CoordinateArray; // Required - needed for map rendering
  polygonStyle?: PolygonStyle;
}

// Individual marker/track data
export interface MarkerData {
  trackTitle: string; // Required - needed for display
  artistName: string; // Required - needed for artist display
  latitude: number; // Required - needed for positioning
  longitude: number; // Required - needed for positioning
  audioUrl: string; // Required - needed for audio playback
  iconUrl?: string; // Optional - can have default fallback
}

// Main event configuration structure
export interface EventConfigType {
  event: EventConfig; // Required - needed for event information
  venue: VenueConfig; // Required - needed for map functionality
  markerData?: MarkerData[];
}

// Legacy support - alternative naming for backwards compatibility
export interface MarkersData extends MarkerData {}

// Utility types for extracting specific parts
export type VenueCoords = VenueConfig["coords"];
export type VenuePolygonStyle = VenueConfig["polygonStyle"];
export type EventPage = EventConfig["page"];

// Type guard functions for runtime type checking
export function isValidCoordinate(coord: unknown): coord is [number, number] {
  return (
    Array.isArray(coord) &&
    coord.length === 2 &&
    typeof coord[0] === "number" &&
    typeof coord[1] === "number"
  );
}

export function isValidMarkerData(marker: unknown): marker is MarkerData {
  return (
    typeof marker === "object" &&
    marker !== null &&
    "trackTitle" in marker &&
    "artistName" in marker &&
    "latitude" in marker &&
    "longitude" in marker &&
    "audioUrl" in marker &&
    typeof (marker as any).trackTitle === "string" &&
    typeof (marker as any).artistName === "string" &&
    typeof (marker as any).latitude === "number" &&
    typeof (marker as any).longitude === "number" &&
    typeof (marker as any).audioUrl === "string"
  );
}

export function isValidEventConfig(config: unknown): config is EventConfigType {
  return (
    typeof config === "object" &&
    config !== null &&
    "event" in config &&
    "venue" in config &&
    typeof (config as any).event === "object" &&
    "id" in (config as any).event &&
    "eventName" in (config as any).event &&
    typeof (config as any).event.id === "string" &&
    typeof (config as any).event.eventName === "string" &&
    typeof (config as any).venue === "object" &&
    "coords" in (config as any).venue &&
    Array.isArray((config as any).venue.coords)
  );
}
