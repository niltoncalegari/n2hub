import React from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import type { MapMetrics } from '@/app/types';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  mapName: string;
  metrics: MapMetrics;
}

export default function MapModal({ isOpen, onClose, mapName, metrics }: MapModalProps) {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mapName} - Score Timeline</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
            <LineChart data={metrics.timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 80 : 30}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="russia" stroke="#ff4444" />
              <Line type="monotone" dataKey="usa" stroke="#4444ff" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 