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
    // variables
    type registerFormData = {
        name:string,
        email:string,
        password:string,
        password_confirmation:string,
        files: File[],
        terms: boolean
    }

    const [formData, setFormData] = useState<registerFormData>({
        name: 'mirko',
        email: 'mirkic@gmail.com',
        password: 'halodobardan',
        password_confirmation: 'halodobardan',
        files : [],
        terms: false
    });

    const [errors, setErrors] = useState<any>({
        name: null,
        email: null,
        password: null,
        password_confirmation: null,
        files: null,
        terms: null
    });

    const [files, setFiles] = useState<File[]>([]);
    const MAX_FILES = 1;

    const [processing, setProcessing] = useState(false);

    // functions
    const onFileValidate = useCallback(
        (file: File): string | null => {
            // Validate file duplication
            if (files.some((f) => (f.name === file.name && f.size === file.size))) {
                return "You can't upload the same file twice.";
            }

            // Validate file type (only images)
            if (!file.type.startsWith("image/")) {
                return "Only image files are allowed";
            }

            // Validate max files
            if (files.length >= MAX_FILES) {
                return `You can only upload up to ${MAX_FILES} files`;
            }
        
            // Validate file size (max 2MB)
            const MAX_SIZE = 2 * 1024 * 1024; // 2MB
            if (file.size > MAX_SIZE) {
                return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`;
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

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        setProcessing(true);
        

        const finalFormData = new FormData();
        finalFormData.append('name', formData.name);
        finalFormData.append('email', formData.email);
        finalFormData.append('password', formData.password);
        finalFormData.append('password_confirmation', formData.password_confirmation);
        finalFormData.append('terms', formData.terms ? '1' : '0');

        if(files.length > 0){
            files.forEach(f => {
                finalFormData.append('image', f);
            })
        }
        else{
                setErrors((prev: any) => ({ ...prev, files: "Profile image is required." }));
                setProcessing(false);
                return;
        }

        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        const res = await fetch('/kurac', {
            method: 'post',
            headers: {
                'X-CSRF-TOKEN': token || '',
            },
            body: finalFormData,
        });

        if(res.status === 422){
            const data = await res.json();
            setErrors(data.errors);
        }
        else if(res.status === 200){
            toast.success("Registration successful! Please log in.");
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
        else{
            toast.error("An unexpected error occurred. Please try again.");
        }
    }

    return (
    <AuthLayout title="Register" description="Enter your details below to create your account.">
        
        <Head title="Register" />

        <Form
            method="post"
            action={'/kurac'}
            className="flex flex-col gap-6"
            onSubmit={handleSubmit}
        >
            <div className="grid gap-8">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        autoComplete="name"
                        name="name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        name="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        autoComplete="new-password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">Confirm password</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        required
                        autoComplete="new-password"
                        name="password_confirmation"
                        placeholder="Confirm password"
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="image">Profile Picture</Label>

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
                            checked={formData.terms}
                            onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                        />
                        <Label htmlFor="terms">I agree to the <Link href="/terms" className='text-blue-500'>terms and conditions</Link>.</Label>
                    </div>
                    <InputError message={errors.terms} />
                </div>

                <Button type="submit" className="w-full text-secondary font-jersey cursor-pointer">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Create account
                </Button>
            </div>

            <div className="text-center text-sm">
                <span>Already have an account? </span>
                <Link href={route('login')} className='text-blue-500'>
                    Log in
                </Link>
            </div>
        </Form>
    </AuthLayout>
);
}