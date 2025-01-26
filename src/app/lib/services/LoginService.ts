import { User } from '../models/User';
import { db } from '../../configs/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    getAuth, 
    setPersistence, 
    browserLocalPersistence,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { validateCPF } from '@/app/lib/utils/cpfValidator';
import { FirebaseError } from 'firebase/app';

interface UserResponse {
    email: string;
    cpf: string;
    name: string;
}

export class LoginService {
    private readonly collectionName = 'users';
    private auth;

    constructor() {
        this.auth = getAuth();
        // Configura a persistência para LOCAL (mantém o usuário logado mesmo após fechar o navegador)
        setPersistence(this.auth, browserLocalPersistence)
            .catch((error) => {
                console.error('Erro ao configurar persistência:', error);
            });
    }

    async createUser(user: User): Promise<void> {
        try {
            // Limpa o CPF antes de verificar
            const cleanCPF = user.cpf.replace(/\D/g, '');
            
            // Verifica se o CPF já existe
            const existingUser = await this.getUserByCPF(cleanCPF);
            if (existingUser) {
                throw new Error('Este CPF já está cadastrado no sistema. Por favor, tente fazer login ou use outro CPF.');
            }

            // Verifica se o email já existe
            const existingEmail = await this.getUserByEmail(user.email);
            if (existingEmail) {
                throw new Error('Este email já está cadastrado no sistema. Por favor, tente fazer login ou use outro email.');
            }

            try {
                // Primeiro, cria o usuário no Authentication
                const auth = getAuth();
                await createUserWithEmailAndPassword(auth, user.email, user.password);

                // Depois, hash a senha para o Firestore
                const hashedPassword = await bcrypt.hash(user.password, 10);

                const userData: User = {
                    ...user,
                    cpf: cleanCPF, // Usa o CPF limpo
                    password: hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                // Por fim, salva no Firestore
                const userRef = doc(db, this.collectionName, cleanCPF);
                await setDoc(userRef, userData);

            } catch (authError) {
                if (authError instanceof FirebaseError) {
                    if (authError.code === 'auth/email-already-in-use') {
                        throw new Error('Este email já está em uso. Por favor, tente fazer login ou use outro email.');
                    }
                    console.error('Erro no Firebase Auth:', authError);
                    throw new Error(`Erro na autenticação: ${authError.message}`);
                }
                throw authError;
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                throw error; // Repassa o erro com a mensagem específica
            }
            console.error('Erro não tratado:', error);
            throw new Error('Erro ao criar usuário: Erro desconhecido');
        }
    }

    async getUserByCPF(cpf: string): Promise<User | null> {
        try {
            // Limpa o CPF antes de buscar
            const cleanCPF = cpf.replace(/\D/g, '');
            const userRef = doc(db, this.collectionName, cleanCPF);
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

    async getUserByEmail(email: string): Promise<UserResponse | null> {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                return {
                    email: userData.email,
                    cpf: userData.cpf,
                    name: userData.name
                };
            }
            return null;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw error;
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

    async validateLogin(emailOrCpf: string, password: string): Promise<User | null> {
        try {
            const isEmail = emailOrCpf.includes('@');
            let user: User | null;
            
            if (isEmail) {
                // Busca primeiro o email para obter o CPF
                const userResponse = await this.getUserByEmail(emailOrCpf);
                if (!userResponse) return null;
                // Usa o CPF para buscar o usuário completo com senha
                user = await this.getUserByCPF(userResponse.cpf);
            } else {
                const cpf = emailOrCpf.replace(/\D/g, '');
                user = await this.getUserByCPF(cpf);
            }

            // 3. Se não encontrou o usuário na nossa base, já retorna null
            if (!user) return null;

            // 4. Verifica se é um usuário do Google (senha vazia na nossa base)
            const isGoogleUser = !user.password;
            
            if (isGoogleUser) {
                // Se for usuário do Google, verifica se ainda está autenticado
                const auth = getAuth();
                const currentUser = auth.currentUser;
                
                if (!currentUser || currentUser.email !== user.email) {
                    // Se não estiver autenticado no Google, pede para usar login do Google
                    throw new Error('Esta conta foi criada com Google. Por favor, use o botão "Entrar com Google".');
                }
                
                return user;
            } else {
                // 5. Se não for usuário do Google, verifica a senha no Firestore
                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) return null;

                // 6. Se as credenciais estão corretas na nossa base, 
                // sincroniza com Firebase Auth
                try {
                    const auth = getAuth();
                    try {
                        await signInWithEmailAndPassword(auth, user.email, password);
                    } catch (authError) {
                        if (authError instanceof FirebaseError) {
                            if (authError.code === 'auth/user-not-found') {
                                try {
                                    await createUserWithEmailAndPassword(auth, user.email, password);
                                } catch (createError) {
                                    if (createError instanceof FirebaseError && 
                                        createError.code !== 'auth/email-already-in-use') {
                                        console.error('Erro ao criar usuário no Firebase Auth:', createError);
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Erro ao sincronizar com Firebase Auth:', error);
                }

                return user;
            }

        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/invalid-credential') {
                    return null;
                }
                if (error.code === 'auth/operation-not-allowed') {
                    throw new Error('Método de login não habilitado. Por favor, contate o administrador.');
                }
                throw new Error(`Erro na validação do login: ${error.message}`);
            }
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro na validação do login: Erro desconhecido');
        }
    }

    async signInWithGoogle(): Promise<{ needsCompletion: boolean }> {
        const provider = new GoogleAuthProvider();
        
        try {
            const result = await signInWithPopup(this.auth, provider);
            const user = result.user;
            
            const existingUser = await this.getUserByEmail(user.email || '');
            
            // Se o usuário existe e tem CPF, login completo
            if (existingUser && existingUser.cpf) {
                return { needsCompletion: false };
            }
            
            // Se não existe, cria um registro inicial sem CPF
            if (!existingUser) {
                const initialUserData = {
                    name: user.displayName || '',
                    email: user.email || '',
                    cpf: '', // Será preenchido depois
                    password: '', // Será preenchido depois
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                // Cria um documento temporário usando o email como ID
                const userRef = doc(db, this.collectionName, user.email || '');
                await setDoc(userRef, initialUserData);
            }
            
            return { needsCompletion: true };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro no login com Google: ${error.message}`);
            }
            throw new Error('Erro no login com Google: Erro desconhecido');
        }
    }

    async updateUserAfterGoogleLogin(cpf: string, password: string): Promise<void> {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            
            if (!currentUser) {
                throw new Error('Usuário não autenticado');
            }

            if (!validateCPF(cpf)) {
                throw new Error('CPF inválido');
            }

            // Verifica se o CPF já existe
            const existingUser = await this.getUserByCPF(cpf);
            if (existingUser) {
                throw new Error('CPF já cadastrado');
            }

            // Hash da senha antes de salvar
            const hashedPassword = await bcrypt.hash(password, 10);

            // Busca o documento temporário pelo email
            const tempUserRef = doc(db, this.collectionName, currentUser.email || '');
            
            // Cria o documento final com o CPF como ID
            const finalUserRef = doc(db, this.collectionName, cpf);
            
            // Atualiza com os dados completos
            await setDoc(finalUserRef, {
                cpf,
                name: currentUser.displayName || '',
                email: currentUser.email || '',
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Remove o documento temporário
            await deleteDoc(tempUserRef);

        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao atualizar usuário: ${error.message}`);
            }
            throw new Error('Erro ao atualizar usuário: Erro desconhecido');
        }
    }

    async checkAuth(): Promise<boolean> {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            
            if (!user) {
                return false;
            }

            // Verifica se o usuário existe na nossa base e tem CPF cadastrado
            const userData = await this.getUserByEmail(user.email || '');
            
            // Se o usuário não existe na nossa base ou não tem CPF
            if (!userData || !userData.cpf) {
                // Se está na rota de completar registro, permite
                if (window.location.pathname === '/complete-registration') {
                    return true;
                }
                // Caso contrário, faz logout
                await auth.signOut();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            return false;
        }
    }

    async signOut(): Promise<void> {
        try {
            const auth = getAuth();
            await auth.signOut();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao fazer logout: ${error.message}`);
            }
            throw new Error('Erro ao fazer logout: Erro desconhecido');
        }
    }
}