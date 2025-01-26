'use client';
import { useState, useEffect } from 'react';
import { LoginService } from '@/app/lib/services/LoginService';
import { useRouter } from 'next/navigation';
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";
import CPFInput from './CPFInput';
import { GoogleIcon } from './icons/GoogleIcon';

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
            const { needsCompletion } = await loginService.signInWithGoogle();
            if (needsCompletion) {
                router.push('/complete-registration');
            } else {
                router.push('/');
            }
        } catch (error) {
            console.error('Erro no registro com Google:', error);
            alert('Erro ao registrar com Google');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
            <Card className="w-full max-w-md border-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-primary">Cadastro</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Preencha os dados abaixo para criar sua conta.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-primary">Nome</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Digite seu nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cpf" className="text-primary">CPF</Label>
                            <CPFInput
                                value={cpf}
                                onChange={handleCPFChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirme a Senha</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirme sua senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className={!passwordsMatch ? 'border-red-500' : ''}
                            />
                            {!passwordsMatch && (
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
                            Cadastrar
                        </Button>

                        <div className="relative my-4">
                            <Separator />
                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-muted-foreground">
                                ou
                            </span>
                        </div>

                        <Button 
                            type="button"
                            variant="outline"
                            onClick={handleGoogleRegister}
                            className="w-full"
                        >
                            <GoogleIcon className="h-5 w-5 mr-2" />
                            Cadastrar com Google
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 