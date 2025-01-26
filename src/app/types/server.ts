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
  IsOfficial: boolean;
  HasPassword: boolean;
  DayNight: string;
  AntiCheat: string;
  Build: string;
}

export interface ServerStatus {
    status: 'online' | 'offline';
    players: number;
    maxPlayers: number;
}

export interface Scores {
    russia: number;
    usa: number;
    server: ServerStatus;
} 