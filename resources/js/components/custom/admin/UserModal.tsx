import { Form } from '@inertiajs/react'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button';
import { LoaderCircle } from "lucide-react";
import { toast } from 'sonner';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import FileUploader from "@/components/custom/fileUploader";
import { useEffect, useState } from 'react';

type GroupModalProps = {
    isOpen: boolean,
    onIsOpenChange: (open: boolean) => void,
    roles: any[],
    userForEdit: any,
    onCreate: (group: any) => void,
    onUpdate: (group: any) => void
}

const GroupModal = ({isOpen, onIsOpenChange, roles, userForEdit, onCreate, onUpdate}: GroupModalProps) => {
    // File upload
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        // If editing and user has an image, load it as a File object
        const loadFileFromPath = async (path: string) => {
            try {
                const response = await fetch(`/storage/${path}`);
                const blob = await response.blob();
                const file = new File([blob], path.split("/").pop() || "image.jpg", { type: blob.type });
                setFiles([file]);
            } catch (error) {
                console.error("Failed to load file from path:", error);
            }
        };

        if (userForEdit?.image) {
            loadFileFromPath(userForEdit.image);
        } else {
            setFiles([]);
        }
    }, [userForEdit]);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={()=>{onIsOpenChange(!isOpen)}}
        >
            <DialogContent className="w-full rounded-2xl sm:max-w-[500px] p-4 bg-secondary overflow-y-auto max-h-[90vh]">
                <Form
                action={userForEdit ? `/update-user` : '/create-user'}
                method='post'
                transform={(data) => {
                    // If editing - include the ID. If creating - exclude the ID
                    const finalData = userForEdit ?
                    {
                        ...data,
                        id: userForEdit.id,
                        image: files
                    } : {
                        ...data,
                        image: files
                    };
                    return finalData;
                }}
                onSuccess={(response:any) => {
                    {userForEdit ? onUpdate(response.props.user) : onCreate(response.props.user)}

                    onIsOpenChange(false);
                    toast.success(userForEdit ? 'User updated successfully.' : 'User created successfully.');
                }}
                onError={() => {
                    toast.error('Failed to save user.');
                }
                }
                resetOnSuccess
                disableWhileProcessing
                options={{
                preserveScroll: true,
                preserveUrl: true,
                }}
                >
                {({errors, processing}) => (
                    <>
                    <DialogHeader className='items-start pb-4 border-b border-primary/10'>
                        <DialogTitle className='font-bold text-xl'>
                            {userForEdit ? 'Edit user' : 'Create New User'}
                        </DialogTitle>

                        <DialogDescription>
                            Enter the details below and click save.
                        </DialogDescription>
                    </DialogHeader>
                
                    <div className="py-4 grid gap-8">
                        {/* name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name" required>Name</Label>
                            <Input
                            id="name"
                            name="name"
                            placeholder='eg. John Doe'
                            required
                            defaultValue={userForEdit?.name || ''}
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" required>Email</Label>
                            <Input
                            id="email"
                            name="email"
                            placeholder='eg. john.doe@example.com'
                            required
                            defaultValue={userForEdit?.email || ''}
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* password */}
                        <div className="grid gap-2">
                            <Label htmlFor="password" required={!userForEdit}>Password</Label>
                            <Input
                            type="password"
                            id="password"
                            name="password"
                            placeholder='Password'
                            required={!userForEdit}
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* position */}
                        <div className="grid gap-2">
                            <Label htmlFor="position">Position</Label>
                            <Input
                            id="position"
                            name="position"
                            placeholder='eg. Software Engineer'
                            defaultValue={userForEdit?.position || ''}
                            />
                            <InputError message={errors.position} />
                        </div>
                        
                        {/* role */}
                        <div className="grid gap-2">
                            <Label required>Role</Label>
                            
                            {roles.map((role, index) => (
                            <div key={index} className="inline-flex gap-2">
                                <Input
                                type="radio"
                                id={`role_${role.id}`}
                                name="role_id" value={role.id}
                                className='w-4 h-4'
                                defaultChecked={(userForEdit && userForEdit.role_id == role.id ) || (!userForEdit && role.name === 'user')}
                                />
                                <Label htmlFor={`role_${role.id}`}>{role.name}</Label>
                            </div>
                            ))}

                            <InputError message={errors.type} />
                        </div>

                        {/* image */}
                        <FileUploader
                            files={files}
                            setFiles={setFiles}
                        />
                    </div>
                
                    <DialogFooter className='pt-4 gap-2 border-t border-primary/10'>
                        <DialogClose asChild className='m-0'>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        
                        <Button type="submit">
                            {processing ? <LoaderCircle className="h-7 w-7 stroke-secondary animate-spin" /> : 'Save'}
                        </Button>
                    </DialogFooter>
                    </>
                )}
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default GroupModal