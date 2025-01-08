export * from './score';

export interface Server {
  Name: string;
  Map: string;
  MapSize: string;
  Gamemode: string;
  Region: string;
  Players: number;
  MaxPlayers: number;
  Hz: number;
  IsOfficial: boolean;
  DayNight: string;
  AntiCheat: string;
} 