'use client';
import { useEffect, useState } from 'react';
import type { ServerResponse } from '../types/server';

interface ServerStatusCardProps {
    name: string;
    status: 'online' | 'offline';
    players: number;
    maxPlayers: number;
}

export default function ServerStatusCard({ }: ServerStatusCardProps) {
    const [server, setServer] = useState<ServerResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServerStatus = async () => {
            try {
                const response = await fetch('https://publicapi.battlebit.cloud/Servers/GetServerList');
                if (!response.ok) {
                    throw new Error('Falha ao carregar dados');
                }
                const servers = await response.json() as ServerResponse[];
                
                // Procura especificamente pelo servidor 190-Y-00
                const targetServer = servers.find(s => s.Name === "190-Y-00");
                
                if (targetServer) {
                    setServer(targetServer);
                    setError(null);
                } else {
                    // Servidor offline - dados padrão
                    setServer({
                        Name: "190-Y-00",
                        Map: "Unknown",
                        MapSize: "Unknown",
                        Gamemode: "Unknown",
                        Region: "Brazil_Central",
                        Players: 0,
                        QueuePlayers: 0,
                        MaxPlayers: 0,
                        Hz: 60,
                        DayNight: "Day",
                        IsOfficial: false,
                        HasPassword: false,
                        AntiCheat: "EAC",
                        Build: "8.0.3"
                    });
                }
            } catch (err) {
                setError('Falha ao carregar dados do servidor');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchServerStatus();
        const interval = setInterval(fetchServerStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger mt-4" role="alert">
                {error}
            </div>
        );
    }

    if (!server) {
        return (
            <div className="col-md-8 mx-auto">
                <p className="text-center">Servidor não encontrado</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center w-full">
            <div className="w-full max-w-2xl">
                <div className="card p-6 text-center bg-card shadow-lg rounded-lg">
                    <h3 className="text-2xl font-bold mb-6">{server.Name}</h3>
                    
                    <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2">
                            <span className="font-semibold">Server status:</span>
                            <div className={`w-3 h-3 rounded-full ${server.Players > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <span className="font-semibold">Players:</span> {server.Players}
                            </div>

                            <div>
                                <span className="font-semibold">Map:</span> {server.Map}
                            </div>

                            <div>
                                <span className="font-semibold">Map Size:</span> {server.MapSize}
                            </div>

                            <div>
                                <span className="font-semibold">Game Mode:</span> {server.Gamemode}
                            </div>

                            <div>
                                <span className="font-semibold">Hz:</span> {server.Hz}
                            </div>

                            <div>
                                <span className="font-semibold">Day/Night:</span> {server.DayNight}
                            </div>

                            <div>
                                <span className="font-semibold">Anti-Cheat:</span> {server.AntiCheat}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}