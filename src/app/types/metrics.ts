import { Timestamp } from 'firebase/firestore'

export interface MapScore {
  map: string
  points: number
}

export interface TeamDailyData {
  totalScore: number
  maps: MapScore[]
}

export interface DailyMetric {
  date: string
  russiaScore: number
  usaScore: number
  russiaMaps: MapScore[]
  usaMaps: MapScore[]
}

export interface TooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: DailyMetric
  }>
  label?: string
}

export type TimestampType = Timestamp | { seconds: number } | { _seconds: number } | string | Date 