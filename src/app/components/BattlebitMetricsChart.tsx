'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { db } from '@/app/configs/firebase'
import { collection, onSnapshot, Timestamp } from 'firebase/firestore'

interface DailyMetric {
  date: string
  russiaScore: number
  usaScore: number
}

export default function BattlebitMetricsChart() {
  const [metrics, setMetrics] = useState<DailyMetric[]>([])

  const getDateFromTimestamp = (timestamp: any): Date => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate()
    }
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000)
    }
    if (timestamp?._seconds) {
      return new Date(timestamp._seconds * 1000)
    }
    return new Date(timestamp)
  }

  useEffect(() => {
    try {
      const unsubscribeRussia = onSnapshot(collection(db, 'scores_russia'), (snapshot) => {
        const scoresByDate: { [key: string]: number } = {}
        
        snapshot.docs.forEach(doc => {
          const data = doc.data()
          const date = getDateFromTimestamp(data.timestamp).toLocaleDateString()
          scoresByDate[date] = (scoresByDate[date] || 0) + (data.points || 0)
        })

        setMetrics(prev => {
          const newMetrics = { ...Object.fromEntries(prev.map(m => [m.date, m])) }
          
          Object.entries(scoresByDate).forEach(([date, score]) => {
            newMetrics[date] = {
              date,
              russiaScore: score,
              usaScore: newMetrics[date]?.usaScore || 0
            }
          })

          return Object.values(newMetrics)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-7)
        })
      })

      const unsubscribeUSA = onSnapshot(collection(db, 'scores_usa'), (snapshot) => {
        const scoresByDate: { [key: string]: number } = {}
        
        snapshot.docs.forEach(doc => {
          const data = doc.data()
          const date = getDateFromTimestamp(data.timestamp).toLocaleDateString()
          scoresByDate[date] = (scoresByDate[date] || 0) + (data.points || 0)
        })

        setMetrics(prev => {
          const newMetrics = { ...Object.fromEntries(prev.map(m => [m.date, m])) }
          
          Object.entries(scoresByDate).forEach(([date, score]) => {
            newMetrics[date] = {
              date,
              russiaScore: newMetrics[date]?.russiaScore || 0,
              usaScore: score
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
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#212529',
              border: '1px solid #495057',
              borderRadius: '4px'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Legend />
          <Bar dataKey="russiaScore" name="Russia" fill="#dc3545" />
          <Bar dataKey="usaScore" name="USA" fill="#0d6efd" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 