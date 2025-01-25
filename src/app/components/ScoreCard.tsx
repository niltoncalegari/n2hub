import React from 'react';
import Image from 'next/image';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/configs/firebase';
import type { ScoreEntry } from '../types/score';
import type { ServerResponse } from '../types/server';

interface ScoreCardProps {
    score: number;
    country: string;
    servers: ServerResponse[];
}

export default function ScoreCard({ country, score, servers }: ScoreCardProps) {
    const addScoreEntry = async (increment: number) => {
      const brazilServer = servers.find(server => server.Region === 'Brazil_Central');
      
      if (!brazilServer) {
        return;
      }

      const scoreEntry: ScoreEntry = {
        points: increment,
        map: brazilServer.Map,
        timestamp: Date.now(),
        region: brazilServer.Region
      };

      try {
        const scoresCollection = collection(db, `scores_${country}`);
        await addDoc(scoresCollection, scoreEntry);
      } catch (error) {
        console.error('Error adding score entry:', error);
      }
    };

    const renderStars = () => {
      // Padrão 6-5-6-5-6-5-6-5-6
      const pattern = [6, 5, 6, 5, 6, 5, 6, 5, 6];
      const stars: React.ReactElement[] = [];
      let count = 0;

      pattern.forEach((starsInRow, rowIndex) => {
        for (let i = 0; i < starsInRow; i++) {
          stars.push(
            <span key={count} style={{ 
              gridRow: Math.floor(rowIndex + 1),
              gridColumn: i + 1,
              transform: rowIndex % 2 === 1 ? 'translateX(50%)' : 'none'
            }}>
              ★
            </span>
          );
          count++;
        }
      });

      return stars;
    };

    return (
      <div className={`card ${country}`}>
        {country === 'usa' && (
          <div className="usa-stars">
            {renderStars()}
          </div>
        )}
        <div className="card-body">
          <h5 className="card-title">{country.toUpperCase()}</h5>
          <p className="score-number">{score}</p>
          <div className="button-container">
            <button className="btn btn-contrast" onClick={() => addScoreEntry(1)}>
              <Image src="https://img.icons8.com/material-outlined/24/000000/murder-chalk.png" width={24} height={24} className="btn-icon" alt="Plus Icon"/>+1
            </button>
            <button className="btn btn-contrast" onClick={() => addScoreEntry(-1)}>
              <Image src="https://img.icons8.com/material-outlined/24/000000/doctors-bag.png" width={24} height={24} className="btn-icon" alt="Minus Icon"/>-1
            </button>
          </div>
        </div>
      </div>
    );
  }