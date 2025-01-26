import { ScoreCard } from './ScoreCard';

interface USAScoreCardProps {
    score: number;
    onIncrement?: () => void;
    onDecrement?: () => void;
}

export function USAScoreCard({ score, onIncrement, onDecrement }: USAScoreCardProps) {
    const renderStars = () => {
        // Padrão 6-6-6-6-6 (adicionando uma estrela nas linhas alternadas)
        const pattern = [6, 6, 6, 6, 6];
        const stars: React.ReactElement[] = [];
        let count = 0;

        pattern.forEach((starsInRow, rowIndex) => {
            const offset = rowIndex % 2 === 1 ? 0.5 : 0;
            const starsInThisRow = rowIndex % 2 === 1 ? 6 : 6; // Mesmo número de estrelas em todas as linhas
            
            for (let i = 0; i < starsInThisRow; i++) {
                stars.push(
                    <span 
                        key={count} 
                        className="usa-star"
                        style={{ 
                            gridRow: rowIndex + 1,
                            gridColumn: `${i + 1 + offset} / span 1`,
                        }}
                    >
                        ★
                    </span>
                );
                count++;
            }
        });

        return stars;
    };

    return (
        <div className="relative">
            <ScoreCard 
                score={score} 
                label="USA" 
                className="usa"
                onIncrement={onIncrement}
                onDecrement={onDecrement}
            />
            <div className="usa-stars">
                {renderStars()}
            </div>
        </div>
    );
} 