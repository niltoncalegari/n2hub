import React from 'react';
import Image from 'next/image';

interface ScoreCardProps {
    country: 'russia' | 'usa';
    score: number;
    onUpdateScore: (increment: number) => void;
  }
  
  export default function ScoreCard({ country, score, onUpdateScore }: ScoreCardProps) {
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
            <button className="btn btn-contrast" onClick={() => onUpdateScore(1)}>
              <Image src="https://img.icons8.com/material-outlined/24/000000/murder-chalk.png" width={24} height={24} className="btn-icon" alt="Plus Icon"/>+1
            </button>
            <button className="btn btn-contrast" onClick={() => onUpdateScore(-1)}>
              <Image src="https://img.icons8.com/material-outlined/24/000000/doctors-bag.png" width={24} height={24} className="btn-icon" alt="Minus Icon"/>-1
            </button>
          </div>
        </div>
      </div>
    );
  }