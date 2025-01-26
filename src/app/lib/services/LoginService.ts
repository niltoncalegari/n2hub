import { User } from '../models/User';
import { db } from '../../configs/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';

export class LoginService {
    private readonly collectionName = 'users';

    async createUser(user: User): Promise<void> {
        try {
            // Verifica se o CPF já existe
            const existingUser = await this.getUserByCPF(user.cpf);
            if (existingUser) {
                throw new Error('CPF já cadastrado');
            }

            const hashedPassword = await bcrypt.hash(user.password, 10);

            const userData: User = {
                ...user,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const userRef = doc(db, this.collectionName, user.cpf);
            await setDoc(userRef, userData);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao criar usuário: ${error.message}`);
            }
            throw new Error('Erro ao criar usuário: Erro desconhecido');
        }
    }

    async getUserByCPF(cpf: string): Promise<User | null> {
        try {
            const userRef = doc(db, this.collectionName, cpf);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                return userDoc.data() as User;
            }
            return null;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar usuário: ${error.message}`);
            }
            throw new Error('Erro ao buscar usuário: Erro desconhecido');
        }
    }

    async getUserByEmail(email: string): Promise<User | null> {
        try {
            const q = query(collection(db, this.collectionName), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                return querySnapshot.docs[0].data() as User;
            }
            return null;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar usuário: ${error.message}`);
            }
            throw new Error('Erro ao buscar usuário: Erro desconhecido');
        }
    }

    async updateUser(cpf: string, userData: Partial<User>): Promise<void> {
        try {
            const userRef = doc(db, this.collectionName, cpf);
            
            // Se houver uma nova senha, encriptar
            if (userData.password) {
                userData.password = await bcrypt.hash(userData.password, 10);
            }

            userData.updatedAt = new Date();
            await updateDoc(userRef, userData);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao atualizar usuário: ${error.message}`);
            }
            throw new Error('Erro ao atualizar usuário: Erro desconhecido');
        }
    }

    async deleteUser(cpf: string): Promise<void> {
        try {
            const userRef = doc(db, this.collectionName, cpf);
            await deleteDoc(userRef);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao deletar usuário: ${error.message}`);
            }
            throw new Error('Erro ao deletar usuário: Erro desconhecido');
        }
    }

    async validateLogin(email: string, password: string): Promise<User | null> {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) return null;

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) return null;

            return user;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro na validação do login: ${error.message}`);
            }
            throw new Error('Erro na validação do login: Erro desconhecido');
        }
    }

    async signInWithGoogle(): Promise<void> {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Opcionalmente, salvar informações adicionais do usuário
            await this.createUser({
                cpf: user.uid, // Usando UID do Google como CPF
                name: user.displayName || '',
                email: user.email || '',
                password: '', // Não é necessário para login Google
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no login com Google: ${error.message}`);
            }
            throw new Error('Erro no login com Google: Erro desconhecido');
        }
    }
}