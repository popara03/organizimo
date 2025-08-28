import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout title="Log in" description="Enter your credentials below to log in.">
            <Head title="Log in" />

            <Form
                method="post"
                action={route('login')}
                disableWhileProcessing
                resetOnSuccess
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-8">
                            <div className="grid gap-2">
                                <Label htmlFor="email" required>Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" required>Password</Label>
                                    {canResetPassword && (
                                        <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    className='w-4 h-4 accent-accent-purple'
                                    value={1} //so it submits 1 in stead of 'on' when checked
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button type="submit" className="w-full text-secondary font-jersey cursor-pointer">
                                {processing && <LoaderCircle className="h-7 w-7 stroke-secondary animate-spin" />}
                                {!processing && 'Log in'}
                            </Button>

                            <div className="text-center text-sm">
                                <span>Don't have an account? </span>
                                <Link href={route('register')} className='text-blue-500 underline'>
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </Form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
