'use client';
import { useState } from 'react';
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
import { GoogleIcon } from './icons/GoogleIcon';

export default function LoginForm() {
    const [emailOrCpf, setEmailOrCpf] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const loginService = new LoginService();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = await loginService.validateLogin(emailOrCpf, password);
            if (user) {
                router.push('/');
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
            const { needsCompletion } = await loginService.signInWithGoogle();
            if (needsCompletion) {
                router.push('/complete-registration');
            } else {
                router.push('/');
            }
        } catch (error) {
            console.error('Erro no login com Google:', error);
            alert('Erro ao fazer login com Google');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
            <Card className="w-full max-w-md border-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-primary">Login</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Digite os seus dados de acesso no campo abaixo.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="emailOrCpf" className="text-primary">E-mail ou CPF</Label>
                            <Input
                                id="emailOrCpf"
                                type="text"
                                placeholder="Digite seu e-mail ou CPF"
                                value={emailOrCpf}
                                onChange={(e) => setEmailOrCpf(e.target.value)}
                                className="text-foreground"
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
                                onChange={(e) => setPassword(e.target.value)}
                                className="text-foreground"
                            />
                        </div>

                        <Button
                            type="button"
                            variant="link"
                            className="px-0 text-sm text-primary hover:text-primary/80"
                            onClick={() => router.push('/forgot-password')}
                        >
                            Esqueci minha senha
                        </Button>

                        <Button type="submit" className="w-full">
                            Acessar
                        </Button>

                        <div className="relative my-4">
                            <Separator />
                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-primary">
                                ou
                            </span>
                        </div>

                        <Button 
                            type="button"
                            variant="google"
                            onClick={handleGoogleLogin}
                            className="w-full"
                        >
                            <GoogleIcon className="h-5 w-5 mr-2" />
                            Entrar com Google
                        </Button>

                        <div className="text-center mt-4">
                            <p className="text-sm text-primary">
                                Ainda não tem uma conta?
                            </p>
                            <Button
                                type="button"
                                variant="link"
                                onClick={() => router.push('/register')}
                                className="mt-1 text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-blue))/80]"
                            >
                                Cadastre-se
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 