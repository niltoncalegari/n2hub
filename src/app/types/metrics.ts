export interface TimelinePoint {
  date: string;
  russia: number;
  usa: number;
}

export interface MapMetrics {
  mapName: string;
  russiaPoints: number;
  usaPoints: number;
  timelineData: TimelinePoint[];
} 