'use client';

import { useState, useEffect } from 'react';
import type { ServerResponse } from '@/app/types/server';
import Loader from './Loader';

export default function ServerStatus() {
  const [servers, setServers] = useState<ServerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/servers');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setServers(data);
      } catch (error) {
        console.error('Erro ao buscar status dos servidores:', error);
        setError('Não foi possível carregar o status dos servidores');
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
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <Loader />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center text-danger">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!servers.length) {
    return (
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <p>Nenhum servidor encontrado</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row mt-4">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center mb-4">Status dos Servidores</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Mapa</th>
                    <th>Jogadores</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {servers.map((server, index) => (
                    <tr key={index}>
                      <td>{server.name}</td>
                      <td>{server.map}</td>
                      <td>{server.players}/{server.maxPlayers}</td>
                      <td>
                        <span className={`badge ${server.online ? 'bg-success' : 'bg-danger'}`}>
                          {server.online ? 'Online' : 'Offline'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 