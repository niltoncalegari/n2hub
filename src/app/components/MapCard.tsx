import React, { useState } from 'react';
import Image from 'next/image';
import type { MapMetrics } from '@/app/types';
import MapModal from '@/app/components/MapModal';

interface MapCardProps {
  mapName: string;
  metrics: MapMetrics;
}

export default function MapCard({ mapName, metrics }: MapCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="col-md-4 mb-4">
      <div 
        className="card map-card" 
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={`/images/maps/${mapName.toLowerCase().replace(/\s+/g, '-')}.jpg`}
          alt={mapName}
          width={400}
          height={200}
          className="card-img-top"
        />
        <div className="card-body">
          <h5 className="card-title">{mapName}</h5>
          <div className="scores">
            <div className="russia-score">
              Russia: {metrics.russiaPoints}
            </div>
            <div className="usa-score">
              USA: {metrics.usaPoints}
            </div>
          </div>
        </div>
      </div>

      <MapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mapName={mapName}
        metrics={metrics}
      />
    </div>
  );
} 