import AuthLayout from '@/layouts/auth-layout';

import { useState, useCallback } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

import FileUploader from '@/components/custom/fileUploader';
import { toast } from "sonner";
import Footer from '@/components/custom/fixed/footer';

export default function Register() {
    // File upload
    const [files, setFiles] = useState<File[]>([]);

    return (
    <>
    <AuthLayout title="Register" description="Enter your details below to create your account.">
        
        <Head title="Register" />

        <Form
            method="post"
            action={'/register'}
            className="flex flex-col gap-4"
            transform={(data) => {
                if(files.length === 0){
                    return { ...data };
                }

                return { ...data, image: files};
            }}
            disableWhileProcessing
            resetOnSuccess
        >
            {({ processing, errors }) => (
                <div className="grid gap-8">
                    <div className="grid gap-2">
                        <Label htmlFor="name" required>Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            autoComplete="name"
                            name="name"
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" required>Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            name="email"
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" required>Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            name="password"
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" required>Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            autoComplete="new-password"
                            name="password_confirmation"
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image">
                            Profile picture
                        </Label>

                        <FileUploader
                            files={files}
                            setFiles={setFiles}
                        />

                        <InputError message={errors.image} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="inline-flex items-center gap-2">
                            <Input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                required
                                className='w-4 h-4 accent-accent-purple'
                                value={1} //so it submits 1 in stead of 'on' when checked
                            />
                            <Label htmlFor="terms" required>I agree to the <Link href="/terms" className='text-blue-500 underline'>terms and conditions</Link>.</Label>
                        </div>
                        <InputError message={errors.terms} />
                    </div>

                    <Button type="submit" className="w-full text-secondary font-jersey cursor-pointer">
                        {processing ? <LoaderCircle className="h-7 w-7 stroke-secondary animate-spin" /> : 'Create account'}
                    </Button>

                    <div className="text-center text-sm">
                        <span>Already have an account? </span>
                        <Link href={route('login')} className='text-blue-500 underline'>
                            Log in
                        </Link>
                    </div>
                </div>
            )}
        </Form>
    </AuthLayout>
    
    <Footer />
    </>
);
}