'use client';
import { UserNav } from './UserNav';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
    const { user } = useAuth();

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className="font-bold text-2xl">N2HUB</div>
                <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
                    <a href="/truco" className="text-sm font-medium transition-colors hover:text-primary">
                        Truco
                    </a>
                </nav>
                <div className="ml-auto flex items-center space-x-4">
                    {user && (
                        <UserNav 
                            userEmail={user.email}
                            userName={user.name}
                        />
                    )}
                </div>
            </div>
        </div>
    );
} 