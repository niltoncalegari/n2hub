import { NextResponse } from 'next/server';

interface ServerResponse {
  Name: string;
  Map: string;
  MapSize: string;
  Gamemode: string;
  Region: string;
  Players: number;
  MaxPlayers: number;
  Hz: number;
  IsOfficial: boolean;
}

export async function GET() {
  try {
    const response = await fetch('https://publicapi.battlebit.cloud/Servers/GetServerList');
    const data = await response.json() as ServerResponse[];
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch server data' }, { status: 500 });
  }
}