import React from 'react';
import styles from './MatchSticks.module.css';

interface MatchSticksProps {
  count: number;
}

export function MatchSticks({ count }: MatchSticksProps) {
  const fullSquares = Math.floor(count / 5);
  const remainingSticks = count % 5;

  return (
    <div className={styles.matchGrid}>
      {/* Quadrados completos */}
      {Array.from({ length: fullSquares }).map((_, squareIndex) => (
        <div key={`square-${squareIndex}`} className={styles.square}>
          <div className={`${styles.matchStick} ${styles.top}`}>
            <div className={styles.stick} /><div className={styles.head} />
          </div>
          <div className={`${styles.matchStick} ${styles.right}`}>
            <div className={styles.stick} /><div className={styles.head} />
          </div>
          <div className={`${styles.matchStick} ${styles.bottom}`}>
            <div className={styles.stick} /><div className={styles.head} />
          </div>
          <div className={`${styles.matchStick} ${styles.left}`}>
            <div className={styles.stick} /><div className={styles.head} />
          </div>
          <div className={`${styles.matchStick} ${styles.center}`}>
            <div className={styles.stick} /><div className={styles.head} />
          </div>
        </div>
      ))}

      {/* Palitos restantes formando próximo quadrado */}
      {remainingSticks > 0 && (
        <div className={styles.square}>
          {Array.from({ length: remainingSticks }).map((_, stickIndex) => {
            const positions = ['top', 'right', 'bottom', 'left', 'center'];
            return (
              <div 
                key={`remaining-${stickIndex}`} 
                className={`${styles.matchStick} ${styles[positions[stickIndex]]}`}
              >
                <div className={styles.stick} />
                <div className={styles.head} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 