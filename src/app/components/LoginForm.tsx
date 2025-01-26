'use client';
import { useState } from 'react';
import { LoginService } from '@/app/lib/services/LoginService';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const loginService = new LoginService();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = await loginService.validateLogin(email, password);
            if (user) {
                router.push('/'); // Redireciona para home após login
            } else {
                alert('Credenciais inválidas');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            alert('Erro ao fazer login');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginService.signInWithGoogle();
            router.push('/');
        } catch (error) {
            console.error('Erro no login com Google:', error);
            alert('Erro ao fazer login com Google');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formLogin">
            <h1>Login</h1>
            <p>Digite os seus dados de acesso no campo abaixo.</p>
            
            <label htmlFor="email">E-mail</label>
            <input 
                type="email" 
                id="email"
                placeholder="Digite seu e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus 
            />
            
            <label htmlFor="password">Senha</label>
            <input 
                type="password" 
                id="password"
                placeholder="Digite sua senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            
            <a href="/forgot-password">Esqueci minha senha</a>
            <button type="submit" className="btn">Acessar</button>
            
            <div className="divider">ou</div>
            
            <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="btn-google"
            >
                <Image 
                    src="/google-icon.png" 
                    alt="Google" 
                    width={20} 
                    height={20} 
                />
                Entrar com Google
            </button>
        </form>
    );
} 