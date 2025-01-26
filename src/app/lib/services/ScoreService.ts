import { Score } from '../models/Score';
import { db } from '@/app/configs/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, onSnapshot, addDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { LoginService } from './LoginService';
import { ServerResponse, Scores } from '@/app/types/server';

interface ScoreData {
    russia: number;
    usa: number;
    server?: {
        status: 'online' | 'offline';
        players: number;
        maxPlayers: number;
    };
}

export class ScoreService {
    private readonly russiaCollection = 'scores_russia';
    private readonly usaCollection = 'scores_usa';
    private readonly scoresDoc = 'current_scores';
    private readonly scoresCollection = 'scores';
    private readonly loginService = new LoginService();
    private readonly serverNames = [
        "[RS] Rogue Soldiers | Hardcore | Conq & Dom | RSClan.gg | Discord.gg/RSclan | 120hz",
        "190-Y-00"
    ];

    async getCurrentUserCPF(): Promise<string> {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user?.email) throw new Error('Usuário não autenticado');
        
        const userData = await this.loginService.getUserByEmail(user.email);
        if (!userData?.cpf) throw new Error('CPF do usuário não encontrado');
        
        return userData.cpf;
    }

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

    async getServerStatus(): Promise<ServerResponse[]> {
        try {
            const response = await fetch('https://publicapi.battlebit.cloud/Servers/GetServerList', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                cache: 'no-cache',
                next: { revalidate: 30 } // Revalidate every 30 seconds
            });

            if (!response.ok) {
                throw new Error('Falha ao carregar dados');
            }

            const servers = await response.json() as ServerResponse[];
            
            const filteredServers = servers.filter(server => 
                this.serverNames.includes(server.Name) && 
                server.Region === 'Brazil_Central'
            );

            if (filteredServers.length === 0) {
                // Retorna servidor offline com dados padrão
                return [{
                    Name: "190-Y-00", // Usando servidor específico como padrão
                    Map: 'Unknown',
                    MapSize: 'Unknown',
                    Gamemode: 'Unknown',
                    Region: 'Brazil_Central',
                    Players: 0,
                    QueuePlayers: 0,
                    MaxPlayers: 0,
                    Hz: 60,
                    DayNight: 'Day',
                    IsOfficial: false,
                    HasPassword: false,
                    AntiCheat: 'EAC',
                    Build: '8.0.3'
                }];
            }

            return filteredServers;
        } catch (error) {
            console.error('Erro ao buscar status do servidor:', error);
            // Em caso de erro, retorna servidor offline
            return [{
                Name: "190-Y-00",
                Map: 'Unknown',
                MapSize: 'Unknown',
                Gamemode: 'Unknown',
                Region: 'Brazil_Central',
                Players: 0,
                QueuePlayers: 0,
                MaxPlayers: 0,
                Hz: 60,
                DayNight: 'Day',
                IsOfficial: false,
                HasPassword: false,
                AntiCheat: 'EAC',
                Build: '8.0.3'
            }];
        }
    }

    async getScores(): Promise<ScoreData> {
        try {
            const [russiaScores, usaScores, servers] = await Promise.all([
                getDocs(collection(db, this.russiaCollection)),
                getDocs(collection(db, this.usaCollection)),
                this.getServerStatus()
            ]);

            const russiaTotal = russiaScores.docs.reduce((acc, doc) => {
                const score = doc.data() as Score;
                return acc + score.points;
            }, 0);

            const usaTotal = usaScores.docs.reduce((acc, doc) => {
                const score = doc.data() as Score;
                return acc + score.points;
            }, 0);

            // Pega o primeiro servidor para status (podemos ajustar se precisar mostrar todos)
            const mainServer = servers[0];

            return {
                russia: russiaTotal,
                usa: usaTotal,
                server: {
                    status: mainServer.Players > 0 ? 'online' as const : 'offline' as const,
                    players: mainServer.Players,
                    maxPlayers: mainServer.MaxPlayers
                }
            };
        } catch (error) {
            console.error('Erro ao buscar scores:', error);
            throw error;
        }
    }

    async updateScores(scores: Partial<Scores>): Promise<void> {
        try {
            const scoreRef = doc(db, this.scoresCollection, this.scoresDoc);
            await setDoc(scoreRef, scores, { merge: true });
        } catch (error) {
            console.error('Erro ao atualizar scores:', error);
            throw new Error('Falha ao atualizar scores');
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

    async addScore(country: 'russia' | 'usa', points: number) {
        try {
            const [userCPF, servers] = await Promise.all([
                this.getCurrentUserCPF(),
                this.getServerStatus()
            ]);

            const currentServer = servers[0]; // Pega o primeiro servidor (190-Y-00)
            const currentMap = currentServer?.Map || 'Unknown';

            const collectionName = country === 'russia' ? this.russiaCollection : this.usaCollection;
            const scoreRef = collection(db, collectionName);
            
            const scoreData: Score = {
                points: points,
                timestamp: new Date().getTime(),
                registeredBy: userCPF,
                map: currentMap,
                region: country === 'russia' ? 'Russia' : 'USA'
            };

            console.log(`Adicionando score para ${country}:`, scoreData);
            
            const docRef = await addDoc(scoreRef, scoreData);
            console.log('Score registrado com ID:', docRef.id, 'Map:', currentMap);

            return docRef;
        } catch (error) {
            console.error(`Erro ao adicionar score para ${country}:`, error);
            throw error;
        }
    }

    subscribeToScores(callback: (scores: ScoreData) => void) {
        const currentScores = { russia: 0, usa: 0 };

        const unsubscribeRussia = onSnapshot(
            collection(db, this.russiaCollection),
            (snapshot) => {
                const total = snapshot.docs.reduce((acc, doc) => {
                    const score = doc.data() as Score;
                    return acc + score.points;
                }, 0);
                currentScores.russia = total;
                callback(currentScores);
                console.log('Russia score atualizado:', currentScores);
            },
            (error) => {
                console.error('Erro no listener Russia:', error);
            }
        );

        const unsubscribeUSA = onSnapshot(
            collection(db, this.usaCollection),
            (snapshot) => {
                const total = snapshot.docs.reduce((acc, doc) => {
                    const score = doc.data() as Score;
                    return acc + score.points;
                }, 0);
                currentScores.usa = total;
                callback(currentScores);
                console.log('USA score atualizado:', currentScores);
            },
            (error) => {
                console.error('Erro no listener USA:', error);
            }
        );

        return () => {
            unsubscribeRussia();
            unsubscribeUSA();
        };
    }
} 