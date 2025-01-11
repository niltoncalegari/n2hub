'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { db } from '@/app/configs/firebase'
import { collection, onSnapshot, Timestamp } from 'firebase/firestore'
import { DailyMetric, TeamDailyData, MapScore, TooltipProps, TimestampType } from '@/app/types/metrics'

export default function BattlebitMetricsChart() {
  const [metrics, setMetrics] = useState<DailyMetric[]>([])

  const getDateFromTimestamp = (timestamp: TimestampType): Date => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate()
    }
    if (typeof timestamp === 'object' && 'seconds' in timestamp) {
      return new Date(timestamp.seconds * 1000)
    }
    if (typeof timestamp === 'object' && '_seconds' in timestamp) {
      return new Date(timestamp._seconds * 1000)
    }
    return new Date(timestamp)
  }

  useEffect(() => {
    try {
      const unsubscribeRussia = onSnapshot(collection(db, 'scores_russia'), (snapshot) => {
        const scoresByDate: { [key: string]: TeamDailyData } = {}
        
        snapshot.docs.forEach(doc => {
          const data = doc.data()
          const date = getDateFromTimestamp(data.timestamp).toLocaleDateString()
          
          if (!scoresByDate[date]) {
            scoresByDate[date] = { totalScore: 0, maps: [] }
          }
          
          scoresByDate[date].totalScore += (data.points || 0)
          scoresByDate[date].maps.push({
            map: data.map || 'Desconhecido',
            points: data.points || 0
          })
        })

        setMetrics(prev => {
          const newMetrics = { ...Object.fromEntries(prev.map(m => [m.date, m])) }
          
          Object.entries(scoresByDate).forEach(([date, data]) => {
            newMetrics[date] = {
              date,
              russiaScore: data.totalScore,
              russiaMaps: data.maps,
              usaScore: newMetrics[date]?.usaScore || 0,
              usaMaps: newMetrics[date]?.usaMaps || []
            }
          })

          return Object.values(newMetrics)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-7)
        })
      })

      const unsubscribeUSA = onSnapshot(collection(db, 'scores_usa'), (snapshot) => {
        const scoresByDate: { [key: string]: TeamDailyData } = {}
        
        snapshot.docs.forEach(doc => {
          const data = doc.data()
          const date = getDateFromTimestamp(data.timestamp).toLocaleDateString()
          
          if (!scoresByDate[date]) {
            scoresByDate[date] = { totalScore: 0, maps: [] }
          }
          
          scoresByDate[date].totalScore += (data.points || 0)
          scoresByDate[date].maps.push({
            map: data.map || 'Desconhecido',
            points: data.points || 0
          })
        })

        setMetrics(prev => {
          const newMetrics = { ...Object.fromEntries(prev.map(m => [m.date, m])) }
          
          Object.entries(scoresByDate).forEach(([date, data]) => {
            newMetrics[date] = {
              date,
              russiaScore: newMetrics[date]?.russiaScore || 0,
              russiaMaps: newMetrics[date]?.russiaMaps || [],
              usaScore: data.totalScore,
              usaMaps: data.maps
            }
          })

          return Object.values(newMetrics)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-7)
        })
      })

      return () => {
        unsubscribeRussia()
        unsubscribeUSA()
      }
    } catch (error) {
      console.error('Firebase Error:', error)
    }
  }, [])

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0].payload
    const formatMapList = (maps: MapScore[]) => {
      const mapScores = maps.reduce((acc: { [key: string]: number }, curr) => {
        acc[curr.map] = (acc[curr.map] || 0) + curr.points
        return acc
      }, {})

      return Object.entries(mapScores)
        .sort((a, b) => b[1] - a[1])
        .map(([map, points]) => `${map}: ${points} pts`)
        .join('\n')
    }

    return (
      <div className="custom-tooltip">
        <p className="tooltip-date">{new Date(label || '').toLocaleDateString()}</p>
        <div className="tooltip-content">
          <div className="tooltip-team">
            <strong style={{ color: '#dc3545' }}>Russia: {data.russiaScore} pts</strong>
            <pre>{formatMapList(data.russiaMaps)}</pre>
          </div>
          <div className="tooltip-team">
            <strong style={{ color: '#0d6efd' }}>USA: {data.usaScore} pts</strong>
            <pre>{formatMapList(data.usaMaps)}</pre>
          </div>
        </div>
      </div>
    )
  }

  if (metrics.length === 0) {
    return <div className="metrics-chart">Carregando dados...</div>
  }

  return (
    <div className="metrics-chart">
      <h2>Pontuação por Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={metrics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            stroke="#fff"
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getDate()}/${date.getMonth() + 1}`
            }}
          />
          <YAxis stroke="#fff" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="russiaScore" name="Russia" fill="#dc3545" />
          <Bar dataKey="usaScore" name="USA" fill="#0d6efd" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 