'use client';

import { useState, useEffect, useMemo } from 'react';
import ServerStatusCard from './ServerStatusCard';
import { ScoreService } from '@/app/lib/services/ScoreService';

export default function ServerStatus() {
    const [serverStatus, setServerStatus] = useState<{
        status: 'online' | 'offline';
        players: number;
        maxPlayers: number;
    }>({
        status: 'offline',
        players: 0,
        maxPlayers: 0
    });

    const scoreService = useMemo(() => new ScoreService(), []);

    useEffect(() => {
        const loadServerStatus = async () => {
            const status = await scoreService.getScores();
            if (status.server) {
                setServerStatus(status.server);
            }
        };

        loadServerStatus();
    }, [scoreService]);

    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
                <div className="col-start-2 col-span-2">
                    <ServerStatusCard 
                        name="190-Y-00"
                        status={serverStatus.status}
                        players={serverStatus.players}
                        maxPlayers={serverStatus.maxPlayers}
                    />
                </div>
            </div>
        </div>
    );
} 