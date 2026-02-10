"use client";

import { useEffect } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
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
import { register as registerUser } from '@/features/auth/api/auth.api';
import { notify } from '@/lib/notify';

const signUpSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type SignUpValues = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
    const { isAuthenticated, isInitialized } = useAuthStore();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpValues) => {
        try {
            await registerUser(data);
            notify.success('Account created successfully!');
            router.push('/signin');
        } catch (error: unknown) {
            notify.error(error instanceof ApiError ? error.message : 'Failed to create account');
        }
    };

    const onError = (errors: FieldErrors<SignUpValues>) => {
        if (errors.confirmPassword && errors.confirmPassword.type === "custom") {
            notify.error("Passwords do not match");
        } else {
            notify.error('Please fix the highlighted fields');
        }
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
            title="Create an account"
            description="Enter your email below to create your account"
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
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            placeholder="nexus_user"
                            type="text"
                            autoCapitalize="none"
                            autoCorrect="off"
                            className={errors.username ? "border-destructive focus-visible:ring-destructive" : ""}
                            {...register('username')}
                        />
                        {errors.username && (
                            <p className="text-sm text-destructive">{errors.username.message}</p>
                        )}
                    </div>

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
                        <Label htmlFor="password">Password</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/signin" className="font-semibold text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </AuthCard>
    );
};

export default SignUpPage;
