'use client';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { LoginService } from '../lib/services/LoginService';
import { User } from '../lib/models/User';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const loginService = new LoginService();

    useEffect(() => {
        const auth = getAuth();
        
        // Verificar localStorage primeiro
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    const userData = await loginService.getUserByEmail(firebaseUser.email || '');
                    if (userData) {
                        setUser(userData);
                        // Armazenar no localStorage
                        localStorage.setItem('user', JSON.stringify(userData));
                    } else {
                        // Se não encontrar na nossa base, fazer logout
                        await auth.signOut();
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                } else {
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
} 