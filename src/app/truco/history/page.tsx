'use client'

import { useEffect, useState } from 'react'
import { db } from '@/config/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import styles from './history.module.css'
import { TrucoGame } from '@/app/types/truco'

export default function TrucoHistory() {
  const [games, setGames] = useState<TrucoGame[]>([])

  useEffect(() => {
    const q = query(collection(db, 'trucoGames'), orderBy('timestamp', 'desc'))
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const gamesData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as TrucoGame[]
      setGames(gamesData)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className={styles.container}>
      <h1>Histórico de Partidas</h1>
      <div className={styles.gamesList}>
        {games.map((game, index) => (
          <div key={index} className={styles.gameCard}>
            <div className={styles.scores}>
              <span>Nós: {game.weScore}</span>
              <span>Eles: {game.theyScore}</span>
            </div>
            <div className={styles.gameInfo}>
              <p>Vencedor: {game.winner}</p>
              <p>Data: {new Date(game.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 