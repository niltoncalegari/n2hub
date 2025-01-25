import { Score } from '../models/Score';
import { db } from '../../configs/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

export class ScoreService {
    private readonly collectionName = 'scores';

    async createScore(score: Score): Promise<void> {
        try {
            const scoreRef = doc(collection(db, this.collectionName));
            await setDoc(scoreRef, {
                ...score,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        } catch (error) {
            if (error instanceof FirebaseError) {
                throw new Error(`Erro ao criar score: ${error.message}`);
            }
            throw error;
        }
    }

    async getScores(): Promise<Score[]> {
        try {
            const scoresRef = collection(db, this.collectionName);
            const querySnapshot = await getDocs(scoresRef);
            return querySnapshot.docs.map(doc => doc.data() as Score);
        } catch (error) {
            throw new Error(`Erro ao buscar scores: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    }
} 