'use client';
import { useState, useEffect } from 'react';
import { LoginService } from '@/app/lib/services/LoginService';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CPFInput from './CPFInput';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [isCpfValid, setIsCpfValid] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const router = useRouter();
    const loginService = new LoginService();

    useEffect(() => {
        setPasswordsMatch(password === confirmPassword || confirmPassword === '');
    }, [password, confirmPassword]);

    const handleCPFChange = (value: string, isValid: boolean) => {
        setCpf(value);
        setIsCpfValid(isValid);
    };

    const isFormValid = () => {
        return (
            name &&
            email &&
            cpf &&
            isCpfValid &&
            password &&
            confirmPassword &&
            passwordsMatch
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isCpfValid) {
            alert('CPF inválido');
            return;
        }

        if (!passwordsMatch) {
            alert('As senhas não coincidem');
            return;
        }

        try {
            await loginService.createUser({
                name,
                email,
                cpf,
                password,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            router.push('/login');
        } catch (error) {
            console.error('Erro no cadastro:', error);
            alert('Erro ao criar conta');
        }
    };

    const handleGoogleRegister = async () => {
        try {
            await loginService.signInWithGoogle();
            // Após o login com Google, redireciona para completar o CPF
            router.push('/complete-registration');
        } catch (error) {
            console.error('Erro no registro com Google:', error);
            alert('Erro ao registrar com Google');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formLogin">
            <h1>Cadastro</h1>
            <p>Preencha os dados abaixo para criar sua conta.</p>
            
            <label htmlFor="name">Nome</label>
            <input 
                type="text" 
                id="name"
                placeholder="Digite seu nome" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            
            <label htmlFor="cpf">CPF</label>
            <CPFInput
                value={cpf}
                onChange={handleCPFChange}
                required
            />
            
            <label htmlFor="email">E-mail</label>
            <input 
                type="email" 
                id="email"
                placeholder="Digite seu e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            
            <label htmlFor="password">Senha</label>
            <input 
                type="password" 
                id="password"
                placeholder="Digite sua senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            
            <label htmlFor="confirmPassword">Confirme a Senha</label>
            <div className="password-input-container">
                <input 
                    type="password" 
                    id="confirmPassword"
                    placeholder="Confirme sua senha" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={!passwordsMatch ? 'invalid' : ''}
                />
                {!passwordsMatch && (
                    <span className="password-error">As senhas não coincidem</span>
                )}
            </div>
            
            <button 
                type="submit" 
                className="btn" 
                disabled={!isFormValid()}
            >
                Cadastrar
            </button>
            
            <div className="divider">ou</div>
            
            <button 
                type="button" 
                onClick={handleGoogleRegister}
                className="btn-google"
            >
                <Image 
                    src="/google-icon.png" 
                    alt="Google" 
                    width={20} 
                    height={20} 
                />
                Cadastrar com Google
            </button>
        </form>
    );
} 