'use client';
import { useState } from 'react';
import { LoginService } from '@/app/lib/services/LoginService';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CPFInput from './CPFInput';

export default function CompleteRegistrationForm() {
    const [cpf, setCpf] = useState('');
    const [isCpfValid, setIsCpfValid] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const router = useRouter();
    const loginService = new LoginService();

    const handleCPFChange = (value: string, isValid: boolean) => {
        setCpf(value);
        setIsCpfValid(isValid);
    };

    const isFormValid = () => {
        return isCpfValid && password && confirmPassword && passwordsMatch;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isCpfValid) {
            alert('CPF inválido');
            return;
        }

        if (password !== confirmPassword) {
            alert('As senhas não coincidem');
            return;
        }

        try {
            await loginService.updateUserAfterGoogleLogin(cpf, password);
            router.push('/');
        } catch (error) {
            console.error('Erro ao completar cadastro:', error);
            alert('Erro ao completar cadastro');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
            <Card className="w-full max-w-md border-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-primary">Complete seu Cadastro</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Para finalizar seu cadastro, precisamos de algumas informações adicionais.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cpf" className="text-primary">CPF</Label>
                            <CPFInput
                                value={cpf}
                                onChange={handleCPFChange}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-primary">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordsMatch(e.target.value === confirmPassword);
                                }}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-primary">Confirme a Senha</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirme sua senha"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setPasswordsMatch(password === e.target.value);
                                }}
                                required
                                className={!passwordsMatch && confirmPassword ? 'border-red-500' : ''}
                            />
                            {!passwordsMatch && confirmPassword && (
                                <p className="text-sm text-red-500">
                                    As senhas não coincidem
                                </p>
                            )}
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={!isFormValid()}
                        >
                            Finalizar Cadastro
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 