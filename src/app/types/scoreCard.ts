import type { ServerResponse } from './server';

export interface ScoreCardProps {
    country: 'russia' | 'usa';
    score: number;
    servers: ServerResponse[];
} 