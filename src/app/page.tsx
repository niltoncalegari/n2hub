'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, runTransaction, doc } from 'firebase/firestore';
import { db } from '@/app/configs/firebase';
import ScoreCard from '@/app/components/ScoreCard';
import ServerStatus from '@/app/components/ServerStatus';
import Image from 'next/image';

export default function Home() {
  const [scores, setScores] = useState({ russia: 0, usa: 0 });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'scores'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified' || change.type === 'added') {
          setScores(prev => ({
            ...prev,
            [change.doc.id]: change.doc.data().value
          }));
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const updateScore = async (country: 'russia' | 'usa', increment: number) => {
    const scoreRef = doc(db, 'scores', country);
    try {
      await runTransaction(db, async (transaction) => {
        const doc = await transaction.get(scoreRef);
        if (!doc.exists()) throw "Document does not exist!";
        const newScore = doc.data().value + increment;
        transaction.update(scoreRef, { value: newScore });
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  };

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
      <div className="row justify-content-center">
        <div className="col-md-4">
          <ScoreCard 
            country="russia" 
            score={scores.russia}
            onUpdateScore={(increment: number) => updateScore('russia', increment)}
          />
        </div>
        <div className="col-md-4">
          <ScoreCard 
            country="usa" 
            score={scores.usa}
            onUpdateScore={(increment: number) => updateScore('usa', increment)}
          />
        </div>
      </div>
      <ServerStatus />
    </div>
  );
}