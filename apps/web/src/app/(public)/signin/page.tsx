"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/apiClient';
import { AuthCard, GoogleAuthButton } from '@/features/auth/components';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { login } from '@/features/auth/api/auth.api';
import { notify } from '@/lib/notify';

const signInSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type SignInValues = z.infer<typeof signInSchema>;

const SignInPage = () => {
    const { setUser, isAuthenticated, isInitialized } = useAuthStore();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInValues) => {
        try {
            const response = await login(data);
            setUser(response.data);
            notify.success('Welcome back!');
            router.push('/dashboard');
        } catch (error: unknown) {
            notify.error(error instanceof ApiError ? error.message : 'Failed to sign in');
        }
    };

    const onError = () => {
        notify.error('Please fix the highlighted fields');
    }

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isInitialized, isAuthenticated, router]);

    if (isInitialized && isAuthenticated) {
        return null;
    }

    return (
        <AuthCard
            title="Welcome back"
            description="Enter your email to sign in to your account"
        >
            <div className="space-y-6">
                <GoogleAuthButton />

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-primary hover:underline hover:text-primary/90"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-semibold text-primary hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </AuthCard>
    );
};

export default SignInPage;
