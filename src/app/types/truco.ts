export interface TrucoGame {
  weScore: number
  theyScore: number
  timestamp: Date
  winner: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  winner: string
} 