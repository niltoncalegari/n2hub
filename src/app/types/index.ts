export * from './score';
export * from './server';

interface TimelineData {
    date: string;
    russia: number;
    usa: number;
}

export interface MapMetrics {
    name: string;
    russia: number;
    usa: number;
    timestamp: string;
    map: string;
    region: string;
    timelineData: TimelineData[];
}

export interface ServerResponse {
    Name: string;
    Map: string;
    MapSize: string;
    Gamemode: string;
    Region: string;
    Players: number;
    QueuePlayers: number;
    MaxPlayers: number;
    Hz: number;
    DayNight: string;
    IsOfficial: boolean;
    HasPassword: boolean;
    AntiCheat: string;
    Build: string;
}

export interface Scores {
    russia: number;
    usa: number;
} 