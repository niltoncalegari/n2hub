'use client';
import { useState, useEffect } from 'react';
import ScoreCard from './ScoreCard';
import Loader from './Loader';
import Image from 'next/image';
import Link from 'next/link';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/configs/firebase';
import BattlebitMetricsChart from './BattlebitMetricsChart';
import ServerStatus from './ServerStatus';

export default function ScoreComponent() {
    const [scores, setScores] = useState({ russia: 0, usa: 0 });
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Buscar dados dos servidores
        const fetchServers = async () => {
            const response = await fetch('/api/servers');
            const data = await response.json();
            setServers(data);
        };

        fetchServers();
        const serverInterval = setInterval(fetchServers, 30000);

        // Monitorar scores em tempo real
        const unsubscribeRussia = onSnapshot(collection(db, 'scores_russia'), (snapshot) => {
            const total = snapshot.docs.reduce((acc, doc) => {
                const points = doc.data()?.points || 0;
                return acc + points;
            }, 0);
            setScores(prev => ({ ...prev, russia: total }));
        });

        const unsubscribeUSA = onSnapshot(collection(db, 'scores_usa'), (snapshot) => {
            const total = snapshot.docs.reduce((acc, doc) => {
                const points = doc.data()?.points || 0;
                return acc + points;
            }, 0);
            setScores(prev => ({ ...prev, usa: total }));
        });

        setLoading(false);

        return () => {
            clearInterval(serverInterval);
            unsubscribeRussia();
            unsubscribeUSA();
        };
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <Image 
                    src="https://battlebit.wiki.gg/images/thumb/e/eb/Bblogo_fp.png/470px-Bblogo_fp.png" 
                    width={470}
                    height={100}
                    alt="Banner" 
                    className="banner"
                />
            </div>
            <div className="row justify-content-center mb-4">
                <div className="col-auto">
                    <div className="d-flex gap-2">
                        <Link href="/metrics" className="btn btn-primary">
                            View Maps Metrics
                        </Link>
                        <Link href="/truco" className="btn btn-success">
                            Truco Counter
                        </Link>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <ScoreCard 
                        country="russia" 
                        score={scores.russia}
                        servers={servers}
                    />
                </div>
                <div className="col-md-4">
                    <ScoreCard 
                        country="usa" 
                        score={scores.usa}
                        servers={servers}
                    />
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-12">
                    <ServerStatus />
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-12">
                    <BattlebitMetricsChart />
                </div>
            </div>
        </div>
    );
} 