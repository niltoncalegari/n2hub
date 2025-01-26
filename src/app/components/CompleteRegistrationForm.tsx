'use client';
import { useState } from 'react';
import { LoginService } from '@/app/lib/services/LoginService';
import { useRouter } from 'next/navigation';
import CPFInput from './CPFInput';

export default function CompleteRegistrationForm() {
    const [cpf, setCpf] = useState('');
    const [isCpfValid, setIsCpfValid] = useState(false);
    const router = useRouter();
    const loginService = new LoginService();

    const handleCPFChange = (value: string, isValid: boolean) => {
        setCpf(value);
        setIsCpfValid(isValid);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isCpfValid) {
            alert('CPF inválido');
            return;
        }

        try {
            // Atualiza o usuário com o CPF
            await loginService.updateUserAfterGoogleLogin(cpf);
            router.push('/');
        } catch (error) {
            console.error('Erro ao completar cadastro:', error);
            alert('Erro ao completar cadastro');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formLogin">
            <h1>Complete seu Cadastro</h1>
            <p>Para finalizar seu cadastro, precisamos do seu CPF.</p>
            
            <label htmlFor="cpf">CPF</label>
            <CPFInput
                value={cpf}
                onChange={handleCPFChange}
                required
                autoFocus
            />
            
            <button 
                type="submit" 
                className="btn"
                disabled={!isCpfValid}
            >
                Finalizar Cadastro
            </button>
        </form>
    );
} 