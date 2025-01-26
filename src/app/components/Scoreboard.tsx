'use client';
import { useEffect, useState, useMemo } from 'react';
import { ScoreService } from '@/app/lib/services/ScoreService';
import ServerStatusCard from './ServerStatusCard';
import { ScoreCard } from './ScoreCard';
import { USAScoreCard } from './USAScoreCard';

interface ServerStatusState {
    status: 'online' | 'offline';
    players: number;
    maxPlayers: number;
}

export default function Scoreboard() {
  const [russiaScore, setRussiaScore] = useState(0);
  const [usaScore, setUsaScore] = useState(0);
  const [serverStatus, setServerStatus] = useState<ServerStatusState>({
    status: 'offline',
    players: 0,
    maxPlayers: 0
  });

  const scoreService = useMemo(() => new ScoreService(), []);

  const handleIncrement = async (country: 'russia' | 'usa') => {
    try {
      await scoreService.addScore(country, 1);
      if (country === 'russia') setRussiaScore(prev => prev + 1);
      else setUsaScore(prev => prev + 1);
    } catch (error) {
      console.error(`Erro ao incrementar score de ${country}:`, error);
    }
  };

  const handleDecrement = async (country: 'russia' | 'usa') => {
    try {
      await scoreService.addScore(country, -1);
      if (country === 'russia') setRussiaScore(prev => prev - 1);
      else setUsaScore(prev => prev - 1);
    } catch (error) {
      console.error(`Erro ao decrementar score de ${country}:`, error);
    }
  };

  useEffect(() => {
    const loadInitialScores = async () => {
      try {
        const scores = await scoreService.getScores();
        setRussiaScore(scores.russia);
        setUsaScore(scores.usa);
        if (scores.server) {
          setServerStatus(scores.server);
        }
      } catch (error) {
        console.error('Erro ao buscar scores:', error);
      }
    };

    loadInitialScores();
    const unsubscribe = scoreService.subscribeToScores((newScores) => {
      setRussiaScore(newScores.russia);
      setUsaScore(newScores.usa);
      if (newScores.server) {
        setServerStatus(newScores.server);
      }
    });

    return () => unsubscribe();
  }, [scoreService]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <ScoreCard 
          score={russiaScore} 
          label="Russia" 
          className="russia"
          onIncrement={() => handleIncrement('russia')}
          onDecrement={() => handleDecrement('russia')}
        />
        <USAScoreCard 
          score={usaScore}
          onIncrement={() => handleIncrement('usa')}
          onDecrement={() => handleDecrement('usa')}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ServerStatusCard 
          name="N2Hub"
          status={serverStatus.status}
          players={serverStatus.players}
          maxPlayers={serverStatus.maxPlayers}
        />
      </div>
    </div>
  );
} 