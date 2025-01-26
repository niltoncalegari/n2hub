import React from 'react';

interface ScoreCardProps {
    score: number;
    label: string;
    className?: string;
    onIncrement?: () => void;
    onDecrement?: () => void;
}

export function ScoreCard({ score, label, className, onIncrement, onDecrement }: ScoreCardProps) {
    return (
        <div className={`score-card ${className}`}>
            <span className="score-value">{score}</span>
            <span className="score-label">{label}</span>
            <div className="score-buttons">
                <button 
                    onClick={onIncrement}
                    className="score-button"
                >
                    <span className="text-xl">+</span>1
                </button>
                <button 
                    onClick={onDecrement}
                    className="score-button"
                >
                    <span className="text-xl">-</span>1
                </button>
            </div>
        </div>
    );
}