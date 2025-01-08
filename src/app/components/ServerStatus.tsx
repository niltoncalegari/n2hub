'use client';

import { useEffect, useState } from 'react';

interface Server {
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

export default function ServerStatus() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serverNames = [
    "[RS] Rogue Soldiers | Hardcore | Conq & Dom | RSClan.gg | Discord.gg/RSclan | 120hz",
    "190-Y-00"
  ];

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch('/api/servers');
        if (!response.ok) {
          throw new Error('Falha ao carregar dados');
        }
        const data = await response.json();
        console.log('Todos os servidores:', data);
        const filteredServers = Array.isArray(data) 
          ? data.filter(server => serverNames.includes(server.Name))
          : [];
        console.log('Servidores filtrados:', filteredServers);
        setServers(filteredServers);
        setError(null);
      } catch (err) {
        setError('Falha ao carregar dados dos servidores');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
    const interval = setInterval(fetchServers, 30000);
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

  if (servers.length === 0) {
    return (
      <div className="col-md-8 mx-auto">
        <p className="text-center">Nenhum servidor encontrado</p>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      {servers.map((server, index) => (
        <div key={index} className="col-md-8">
          <div className={`card text-center server-card ${server.Players > 0 ? 'server-card-ok' : ''}`}>
            <div className="card-header">
              <h5 className="mb-0">
                <button className="btn btn-link" type="button">
                  {server.Name}
                </button>
              </h5>
            </div>
            <div className="card-body">
              <div className="status-container">
                <span>Server status:</span>
                <div className={`status-indicator ${server.Players > 0 ? 'green' : 'red'}`}></div>
              </div>
              <div className="server-info">
                <p>Players: {server.Players}</p>
                <p>Map: {server.Map}</p>
                <p>Map Size: {server.MapSize}</p>
                <p>Game Mode: {server.Gamemode}</p>
                <p>Hz: {server.Hz}</p>
                <p>Day/Night: {server.DayNight}</p>
                <p>Anti-Cheat: {server.AntiCheat}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 