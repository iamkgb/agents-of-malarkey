export interface MarkerData {
  trackTitle: string;
  artistName: string;
  latitude: number;
  longitude: number;
  audioUrl: string;
  iconUrl: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}
