"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string; // allow overrides if needed
}

const AuthCard = ({ title, description, children, className }: AuthCardProps) => {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className={`glass-card w-full max-w-md border-border/50 shadow-xl ${className || ''}`}>
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
                    {description && (
                        <CardDescription className="text-muted-foreground">
                            {description}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthCard;
