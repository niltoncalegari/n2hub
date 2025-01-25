import { Login } from '../domain/entities/Login';
import { db } from '../config/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export class LoginService {
    private readonly collectionName = 'users';

    // Criar novo usuário
    async createUser(login: Login): Promise<void> {
        try {
            // Verifica se o CPF já existe
            const existingUser = await this.getUserByCPF(login.cpf);
            if (existingUser) {
                throw new Error('CPF já cadastrado');
            }

            // Encripta a senha
            const hashedPassword = await bcrypt.hash(login.password, 10);

            const userData: Login = {
                ...login,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const userRef = doc(db, this.collectionName, login.cpf);
            await setDoc(userRef, userData);
        } catch (error) {
            throw new Error(`Erro ao criar usuário: ${error.message}`);
        }
    }

    // Buscar usuário por CPF
    async getUserByCPF(cpf: string): Promise<Login | null> {
        try {
            const userRef = doc(db, this.collectionName, cpf);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                return userDoc.data() as Login;
            }
            return null;
        } catch (error) {
            throw new Error(`Erro ao buscar usuário: ${error.message}`);
        }
    }

    // Buscar usuário por email
    async getUserByEmail(email: string): Promise<Login | null> {
        try {
            const q = query(collection(db, this.collectionName), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                return querySnapshot.docs[0].data() as Login;
            }
            return null;
        } catch (error) {
            throw new Error(`Erro ao buscar usuário: ${error.message}`);
        }
    }

    // Atualizar usuário
    async updateUser(cpf: string, userData: Partial<Login>): Promise<void> {
        try {
            const userRef = doc(db, this.collectionName, cpf);
            
            // Se houver uma nova senha, encriptar
            if (userData.password) {
                userData.password = await bcrypt.hash(userData.password, 10);
            }

            userData.updatedAt = new Date();
            await updateDoc(userRef, userData);
        } catch (error) {
            throw new Error(`Erro ao atualizar usuário: ${error.message}`);
        }
    }

    // Deletar usuário
    async deleteUser(cpf: string): Promise<void> {
        try {
            const userRef = doc(db, this.collectionName, cpf);
            await deleteDoc(userRef);
        } catch (error) {
            throw new Error(`Erro ao deletar usuário: ${error.message}`);
        }
    }

    // Validar login
    async validateLogin(email: string, password: string): Promise<Login | null> {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) return null;

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) return null;

            return user;
        } catch (error) {
            throw new Error(`Erro na validação do login: ${error.message}`);
        }
    }
} 