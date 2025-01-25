import { Score } from '../models/Score';
import { db } from '../../configs/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

export class ScoreService {
    private readonly russiaCollection = 'scores_russia';
    private readonly usaCollection = 'scores_usa';

    async createScore(score: Score): Promise<void> {
        try {
            const scoreRef = doc(collection(db, this.russiaCollection));
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
            const scoresRef = collection(db, this.russiaCollection);
            const querySnapshot = await getDocs(scoresRef);
            return querySnapshot.docs.map(doc => doc.data() as Score);
        } catch (error) {
            throw new Error(`Erro ao buscar scores: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    }

    async deleteAllScores(): Promise<void> {
        try {
            const russiaRef = collection(db, this.russiaCollection);
            const russiaSnapshot = await getDocs(russiaRef);
            
            const russiaDeletes = russiaSnapshot.docs.map(docSnapshot => {
                console.log('Deletando documento Russia:', docSnapshot.id);
                return deleteDoc(doc(db, this.russiaCollection, docSnapshot.id));
            });

            const usaRef = collection(db, this.usaCollection);
            const usaSnapshot = await getDocs(usaRef);
            
            const usaDeletes = usaSnapshot.docs.map(docSnapshot => {
                console.log('Deletando documento USA:', docSnapshot.id);
                return deleteDoc(doc(db, this.usaCollection, docSnapshot.id));
            });
            
            await Promise.all([...russiaDeletes, ...usaDeletes]);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao deletar scores: ${error.message}`);
            }
            throw new Error('Erro ao deletar scores: Erro desconhecido');
        }
    }
} 