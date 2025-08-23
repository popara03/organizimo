import AuthLayout from '@/layouts/auth-layout';

import { useState, useCallback } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
} from "@/components/ui/file-upload";

import { toast } from "sonner";

export default function Register() {
    const [files, setFiles] = useState<File[]>([]);
    const MAX_FILES = 1;
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB

    const onFileValidate = useCallback(
        (file: File): string | null => {
            // Validate file duplication
            if (files.some((f) => (f.name === file.name && f.size === file.size))) {
                return "This file is already uploaded.";
            }

            // Validate file type (only images)
            if (!file.type.startsWith("image/")) {
                return "Only image files are allowed.";
            }

            // Validate max files
            if (files.length >= MAX_FILES) {
                return `You can upload up to ${MAX_FILES} file(s).`;
            }
        
            // Validate file size (max 2MB)
            if (file.size > MAX_SIZE) {
                return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB.`;
            }
        
            return null;
        },
        [files],
    );
    const onFileReject = useCallback((file: File, message: string) => {
        toast.error(message);
    }, []);
    const handleFileRemove = (file: File) => {
        setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
    };

    return (
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

                        <FileUpload
                        name='image'
                        accept="image/*"
                        maxFiles={MAX_FILES}
                        value={files}
                        onValueChange={setFiles}
                        onFileValidate={onFileValidate}
                        onFileReject={onFileReject}
                        className="w-full"
                        >
                            {/* dropzone */}
                            <FileUploadDropzone className='w-full h-48 p-0'>
                                <div className="w-full h-full p-4 flex flex-col justify-center items-center gap-2 hover:opacity-50 cursor-pointer">
                                    <div className="flex items-center justify-center rounded-full border p-2">
                                        <Upload className="size-4 text-muted-foreground" />
                                    </div>
                                    <p className="font-medium text-sm">Drag & drop files here</p>
                                    <p className="text-muted-foreground text-xs">
                                        Or click to browse (max 2 files)
                                    </p>
                                </div>
                            </FileUploadDropzone>

                            {/* uploaded files */}
                            <FileUploadList>
                                {files.map((file) => (
                                <FileUploadItem key={file.name} value={file}>
                                    <FileUploadItemPreview />
                                    <FileUploadItemMetadata />
                                    <FileUploadItemDelete onClick={() => handleFileRemove(file)} asChild>
                                        <Button variant="ghost" size="icon" className="size-7 cursor-pointer hover:opacity-50">
                                            <X/>
                                        </Button>
                                    </FileUploadItemDelete>
                                </FileUploadItem>
                                ))}
                            </FileUploadList>
                        </FileUpload>

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
                        {processing && <LoaderCircle className="h-7 w-7 stroke-secondary animate-spin" />}
                        {!processing && 'Create account'}
                    </Button>

                    <div className="text-center text-sm">
                        <span>Already have an account? </span>
                        <Link href={route('login')} className='text-blue-500 text-blue-500 underline'>
                            Log in
                        </Link>
                    </div>
                </div>
            )}
        </Form>
    </AuthLayout>
);
}