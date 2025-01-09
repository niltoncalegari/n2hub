'use client'

import { useState } from 'react'
import { db } from '@/app/configs/firebase'
import { addDoc, collection } from 'firebase/firestore'
import styles from './truco.module.css'
import { WinnerModal } from './components/WinnerModal'
import { MatchSticks } from './components/MatchSticks'

export default function TrucoCounter() {
  const [weScore, setWeScore] = useState(0)
  const [theyScore, setTheyScore] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [winner, setWinner] = useState('')

  const handleScore = (team: 'we' | 'they', operation: 'add' | 'subtract') => {
    if (team === 'we') {
      if (operation === 'add' && weScore < 30) {
        const newScore = weScore + 1
        setWeScore(newScore)
        if (newScore >= 30) {
          setWinner('Nós')
          setShowModal(true)
        }
      } else if (operation === 'subtract' && weScore > 0) {
        setWeScore(prev => prev - 1)
      }
    } else {
      if (operation === 'add' && theyScore < 30) {
        const newScore = theyScore + 1
        setTheyScore(newScore)
        if (newScore >= 30) {
          setWinner('Eles')
          setShowModal(true)
        }
      } else if (operation === 'subtract' && theyScore > 0) {
        setTheyScore(prev => prev - 1)
      }
    }
  }

  const saveGame = async () => {
    try {
      await addDoc(collection(db, 'trucoGames'), {
        weScore,
        theyScore,
        timestamp: new Date(),
        winner
      })
    } catch (error) {
      console.error('Erro ao salvar o jogo:', error)
    }
  }

  const handleResetGame = async () => {
    await saveGame()
    setWeScore(0)
    setTheyScore(0)
    setShowModal(false)
  }

  const handleKeepPlaying = () => {
    saveGame()
    setShowModal(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.scoreBoard}>
        <div className={styles.team}>
          <h2>NÓS</h2>
          <MatchSticks count={weScore} />
          <div className={styles.scoreContainer}>
            <div className={styles.score}>{weScore}</div>
            <div className={styles.buttons}>
              <button onClick={() => handleScore('we', 'add')}>+</button>
              <button onClick={() => handleScore('we', 'subtract')}>-</button>
            </div>
          </div>
        </div>

        <div className={styles.divider}>
          <div className={styles.maxScore}>30</div>
        </div>

        <div className={styles.team}>
          <h2>ELES</h2>
          <MatchSticks count={theyScore} />
          <div className={styles.scoreContainer}>
            <div className={styles.score}>{theyScore}</div>
            <div className={styles.buttons}>
              <button onClick={() => handleScore('they', 'add')}>+</button>
              <button onClick={() => handleScore('they', 'subtract')}>-</button>
            </div>
          </div>
        </div>
      </div>

      <WinnerModal 
        isOpen={showModal}
        onClose={handleKeepPlaying}
        onConfirm={handleResetGame}
        winner={winner}
      />
    </div>
  )
} 