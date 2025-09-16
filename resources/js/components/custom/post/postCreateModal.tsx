import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import FileUploader from "@/components/custom/fileUploader";

import { Form } from '@inertiajs/react'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from "lucide-react";
import { toast } from 'sonner';

type PostModalProps = {
    isOpen: boolean,
    onIsOpenChange: (open: boolean) => void,
    postForEdit: any,
    groups: any[],
    activeGroupId?: number | null,
    onCreate: (group: any) => void,
    onUpdate: (group: any) => void
}

const PostCreateModal = ({isOpen, onIsOpenChange, postForEdit, groups, activeGroupId, onCreate, onUpdate}: PostModalProps) => {
    // Content
    const [content, setContent] = useState<string>(postForEdit?.content || 'KURAC');

    // group
    const [group, setGroup] = useState<any>(null);
    if(activeGroupId && !group){
        setGroup(activeGroupId);
    }
    
    // File upload
    const [files, setFiles] = useState<File[]>([]);

    // onload reset modal depending on action (edit/create)
    useEffect(() => {
        if(postForEdit){
            setGroup(postForEdit.group.id);
            postForEdit.files?.forEach((f:any) => {
                setFiles((prev) => [...prev, f]);
            });
        }
        else{
            setGroup(activeGroupId || null);
            setFiles([]);
        }
    }, [postForEdit, isOpen]);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={()=>{onIsOpenChange(!isOpen)}}
        >
            <DialogContent className="w-full rounded-2xl sm:max-w-[800px] p-4 bg-secondary overflow-y-auto scrollbar max-h-[90vh]">
                <Form
                action={postForEdit ? `/update-post` : '/create-post'}
                method={postForEdit ? 'put' : 'post'}
                onSuccess={(response:any) => {
                    toast.success(postForEdit ? 'Post updated successfully.' : 'Post created successfully.');
                    {postForEdit ? onUpdate(response.props.post) : onCreate(response.props.post)}
                }}
                onError={() => {
                    toast.error('Failed to save post.');
                }
                }
                resetOnSuccess
                disableWhileProcessing
                options={{
                preserveScroll: true,
                preserveUrl: true,
                }}
                >
                {({errors, processing}) => {
                        return (
                            <>
                                <DialogHeader className='items-start pb-4 border-b border-primary/10'>
                                    <DialogTitle className='font-bold text-xl'>
                                        {postForEdit ? 'Edit Post' : 'Create new post'}
                                    </DialogTitle>

                                    <DialogDescription>
                                        Enter the details below and click save.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="py-4 grid gap-8">
                                    {/* title */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="title" required>Title</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder='Post title'
                                            required
                                            defaultValue={postForEdit?.title || ''}
                                            className='px-4'
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    {/* Content */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="content" required>Content</Label>
                                        <div className="flex flex-col gap-4">
                                            <div className="w-full flex flex-col gap-2">
                                                {/* editor */}
                                                <Textarea
                                                    id="content"
                                                    name="content"
                                                    placeholder='Post content'
                                                    required
                                                    value={content}
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                                                    className='w-full min-h-[200px] p-4 !bg-secondary text-primary border border-primary/10 focus:border-primary rounded-md overflow-y-auto scrollbar'
                                                />

                                                <InputError message={errors.content} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Group */}
                                    <div className="grid gap-2">
                                        <Label htmlFor='group' required>Group</Label>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className='w-full h-fit bg-secondary text-primary border font-normal justify-start outline-none'>{group ? groups.find((g: any) => g.id == group)?.name : "Select"}</Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="start" className='bg-secondary p-0'>
                                                <DropdownMenuRadioGroup value={group} onValueChange={(value) => { setGroup(value) } }>
                                                    <DropdownMenuRadioItem value="" className='w-full h-full px-4 ps-8 py-2 flex items-center text-primary text-left hover:opacity-100 hover:bg-primary/5 cursor-pointer '>Select</DropdownMenuRadioItem>
                                                    {groups.map((g) => (
                                                        <DropdownMenuRadioItem key={g.id} value={g.id} className='w-full h-full px-4 ps-8 py-2 flex items-center text-primary text-left hover:opacity-100 hover:bg-primary/5 cursor-pointer '>{g.name}</DropdownMenuRadioItem>
                                                    ))}
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <InputError message={errors.group} />
                                    </div>

                                    {/* File picker */}
                                    <div className="grid gap-2">
                                        <Label>Files</Label>

                                        <FileUploader
                                            files={files}
                                            setFiles={setFiles}
                                            maxFiles={5} />

                                        <InputError message={errors.files} />
                                    </div>
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
                        )
                    }}
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default PostCreateModal;