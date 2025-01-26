'use client';
import { useCallback, useMemo } from 'react';
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import { LoginService } from "../lib/services/LoginService";

interface UserNavProps {
    userEmail: string | null;
    userName: string | null;
}

export function UserNav({ userEmail, userName }: UserNavProps) {
    const router = useRouter();
    const loginService = useMemo(() => new LoginService(), []);

    const handleSignOut = useCallback(async () => {
        try {
            await loginService.signOut();
            router.push('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    }, [loginService, router]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{userName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-56 bg-popover border border-border shadow-md" 
                align="end" 
                forceMount
                sideOffset={5}
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {userEmail}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem 
                        onClick={() => router.push('/settings')}
                        className="cursor-pointer"
                    >
                        Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="cursor-pointer"
                >
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 