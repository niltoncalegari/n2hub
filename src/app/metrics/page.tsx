'use client';

import { useEffect, useState } from 'react';
import { collection, query, getDocs, QueryDocumentSnapshot, Query } from 'firebase/firestore';
import { db } from '../configs/firebase';
import MapCard from '../components/MapCard';
import { MapMetrics } from '../types/metrics';
import Link from 'next/link';
import type { ScoreEntry } from '@/app/types';

const MAPS = [
  'Azagor', 'Basra', 'Construction', 'District', 'Dusty Dew',
  'Eduardovo', 'Frugis', 'Isle', 'Lonovo', 'Multu Islands', 'Namak',
  'Oil Dunes', 'Outskirts', 'River', 'Salhan', 'Sandy Sunset', 'Tensa Town', 'Valley',
  'Wakistan', 'Wine Paradise', 'Hot Land', 'Zalfi'
];

function processTimelineData(
  russiaDocs: QueryDocumentSnapshot<ScoreEntry>[],
  usaDocs: QueryDocumentSnapshot<ScoreEntry>[]
) {
  const timelineMap = new Map();

  // Russ data processor
  russiaDocs.forEach(doc => {
    const date = new Date(doc.data().timestamp).toLocaleDateString();
    if (!timelineMap.has(date)) {
      timelineMap.set(date, { date, russia: 0, usa: 0 });
    }
    timelineMap.get(date).russia += doc.data().points;
  });

  // Usa data processor
  usaDocs.forEach(doc => {
    const date = new Date(doc.data().timestamp).toLocaleDateString();
    if (!timelineMap.has(date)) {
      timelineMap.set(date, { date, russia: 0, usa: 0 });
    }
    timelineMap.get(date).usa += doc.data().points;
  });

  // Converter Map para array e ordenar por data
  return Array.from(timelineMap.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export default function MetricsPage() {
  const [mapMetrics, setMapMetrics] = useState<Record<string, MapMetrics>>({});
  const [loading, setLoading] = useState(true);
  const [mapsWithData, setMapsWithData] = useState<string[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const metrics: Record<string, MapMetrics> = {};
      const mapsWithMetrics: string[] = [];
      
      // Buscar dados Russia
      const russiaQuery = query(collection(db, 'scores_russia')) as Query<ScoreEntry>;
      const russiaSnapshot = await getDocs(russiaQuery);
      
      // Buscar dados USA
      const usaQuery = query(collection(db, 'scores_usa')) as Query<ScoreEntry>;
      const usaSnapshot = await getDocs(usaQuery);

      // Processar dados
      MAPS.forEach(mapName => {
        const russiaPoints = russiaSnapshot.docs
          .filter(doc => doc.data().map === mapName)
          .reduce((acc, doc) => acc + doc.data().points, 0);

        const usaPoints = usaSnapshot.docs
          .filter(doc => doc.data().map === mapName)
          .reduce((acc, doc) => acc + doc.data().points, 0);

        // Só adiciona mapas que têm pontuação
        if (russiaPoints > 0 || usaPoints > 0) {
          mapsWithMetrics.push(mapName);
          
          // Criar timeline data
          const timelineData = processTimelineData(
            russiaSnapshot.docs.filter(doc => doc.data().map === mapName),
            usaSnapshot.docs.filter(doc => doc.data().map === mapName)
          );

          metrics[mapName] = {
            mapName,
            russiaPoints,
            usaPoints,
            timelineData
          };
        }
      });

      setMapMetrics(metrics);
      setMapsWithData(mapsWithMetrics);
      setLoading(false);
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="metrics-page">
        <div className="text-center text-white">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="metrics-page">
      <Link href="/" className="btn btn-primary back-button">
        ← Back to Scoreboard
      </Link>
      <div className="container">
        <h1 className="text-center mb-4">Map Metrics</h1>
        <div className="row">
          {mapsWithData.map(mapName => (
            <MapCard
              key={mapName}
              mapName={mapName}
              metrics={mapMetrics[mapName]}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 