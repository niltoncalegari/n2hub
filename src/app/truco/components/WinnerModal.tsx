'use client'

import { ModalProps } from '@/app/types/truco'
import styles from './WinnerModal.module.css'

export function WinnerModal({ isOpen, onClose, onConfirm, winner }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>🎉 Fim de Jogo! 🎉</h2>
        <p>{winner} venceram!</p>
        <p>O que deseja fazer?</p>
        <div className={styles.buttons}>
          <button onClick={onConfirm}>Limpar Placar</button>
          <button onClick={onClose}>Manter Placar</button>
        </div>
      </div>
    </div>
  )
} 