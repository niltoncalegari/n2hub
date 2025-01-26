'use client';
import { useState, useEffect, useMemo } from 'react';
import { ScoreCard } from './ScoreCard';
import Loader from './Loader';
import Image from 'next/image';
import { USAScoreCard } from './USAScoreCard';
import { ScoreService } from '@/app/lib/services/ScoreService';

export default function ScoreComponent() {
    const [scores, setScores] = useState<{
        russia: number;
        usa: number;
        server?: {
            status: 'online' | 'offline';
            players: number;
            maxPlayers: number;
        };
    }>({ russia: 0, usa: 0 });
    const [loading, setLoading] = useState(true);
    const scoreService = useMemo(() => new ScoreService(), []);

    useEffect(() => {
        const loadInitialScores = async () => {
            try {
                const initialScores = await scoreService.getScores();
                setScores({
                    russia: initialScores.russia,
                    usa: initialScores.usa,
                    server: initialScores.server
                });
            } catch (error) {
                console.error('Erro ao carregar scores iniciais:', error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialScores();
        const unsubscribe = scoreService.subscribeToScores((newScores) => {
            setScores(prev => ({
                russia: newScores.russia || prev.russia,
                usa: newScores.usa || prev.usa
            }));
        });

        return () => unsubscribe();
    }, [scoreService]);

    const handleIncrement = async (country: 'russia' | 'usa') => {
        try {
            await scoreService.addScore(country, 1);
        } catch (error) {
            console.error(`Erro ao incrementar score de ${country}:`, error);
        }
    };

    const handleDecrement = async (country: 'russia' | 'usa') => {
        try {
            await scoreService.addScore(country, -1);
        } catch (error) {
            console.error(`Erro ao decrementar score de ${country}:`, error);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {/* Banner em container separado */}
            <div className="container mx-auto p-4 flex justify-center">
                <Image 
                    src="https://battlebit.wiki.gg/images/thumb/e/eb/Bblogo_fp.png/470px-Bblogo_fp.png" 
                    width={470}
                    height={100}
                    alt="Banner" 
                    className="banner"
                />
            </div>

            {/* Score Cards em container separado */}
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <ScoreCard 
                            score={scores.russia}
                            label="Russia"
                            className="russia"
                            onIncrement={() => handleIncrement('russia')}
                            onDecrement={() => handleDecrement('russia')}
                        />
                    </div>
                    <div className="col-span-1">
                        <USAScoreCard 
                            score={scores.usa}
                            onIncrement={() => handleIncrement('usa')}
                            onDecrement={() => handleDecrement('usa')}
                        />
                    </div>
                </div>
            </div>
        </>
    );
} 