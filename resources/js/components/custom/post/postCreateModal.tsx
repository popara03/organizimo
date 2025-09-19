import { useContext, useEffect, useState } from 'react'

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

import { Form, router } from '@inertiajs/react'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from "lucide-react";
import { toast } from 'sonner';
import { PostsContext } from '@/providers/postsProvider';
import { ExtendedFile } from '@/components/custom/fileUploader';

type PostModalProps = {
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    postForEdit?: any,
    groups: any[],
    activeGroupId: number | null,
}

/*
ako ima match - ignore
ako nema match - new je
provera postojecih u bazi, razlika sa existingFiles - obrisani

Fora je sto se trenutno oslanjam samo na indexe nizova, a zab sam da setExistingFiles se setuju on-load, a files su odvojeni u drugi state i ako slucajno korisnik obrise iz tog state - parnjaci ova 2 niza vise nisu tacni.
Zato je mozda bolje bilo da smo zadrzali prosireni File tip jer ih je to drzalo zajedno u jednom state-u sve do submita, a pred submit sam iz njih mapirao novi niz sa ID-jevima. A posto je submit vec pokrenut, tacnost parnjaka ova 2 niza ce biti 100%. 
*/

const PostCreateModal = ({isOpen, onOpenChange, postForEdit, groups, activeGroupId}: PostModalProps) => {
    const {updatePostsOnEdit, updatePostsOnCreate} = useContext(PostsContext);

    const [data, setData] = useState({
        title: postForEdit?.title || '',
        content: postForEdit?.content || '',
        group: postForEdit?.group?.id || '',
        files: [] as ExtendedFile[],
    });

    // onload reset modal depending on action (edit/create)
    useEffect(() => {
        if (postForEdit) {
            setData({
                title: postForEdit.title,
                content: postForEdit.content,
                group: postForEdit.group.id,
                files: [],    // reset files first
            });

            // fetch function for exisiting files (fileUploader needs File objects)
            async function loadFileFromPath(file: any){
                try {
                    const response = await fetch(`/storage/${file.path}`);
                    const blob = await response.blob();
                    const newFile = new File([blob], file.name || "attachment.jpg", { type: blob.type });
                    
                    // add existingId flag to identify existing files
                    const extendedFile: ExtendedFile = Object.assign(newFile, { existingId: file.id });

                    return extendedFile;
                } catch (error) {
                    console.error("Failed to load file from path:", error);
                }
            };

            // If post already has files, load them
            if (postForEdit?.files && postForEdit.files.length > 0) {
                Promise.all(postForEdit.files.map((file: any) => loadFileFromPath(file)))
                .then((loadedFiles) => {
                    // set files to the state
                    setData((prevData) => ({
                        ...prevData,
                        files: loadedFiles,
                    }));
                });
            }
        } else {
            setData({
                title: '',
                content: '',
                group: activeGroupId || null,
                files: [],
            });
        }
    }, [isOpen]);
    
    const [errors, setErrors] = useState<any>({});
    const [processing, setProcessing] = useState(false);

    function editSubmission(e: any) {
        e.preventDefault();

        setProcessing(true);
        setErrors({});

        router.post('update-post', {
            id: postForEdit.id,
            ...data,
            existingFiles: data.files.map(f => f.existingId ? {attachment_id: f.existingId} : {attachment_id: null}),
        }, 
        { onSuccess: (response) => {
            updatePostsOnEdit(response.props.updated_post);
            toast.success('Post updated successfully.');
            onOpenChange(false);
        }, onError: (errors) => {
            setErrors(errors);
            toast.error("Error submitting the form." + JSON.stringify(errors));
        },
        onFinish: () => {
            setProcessing(false);
        }
        });
    }

    function createSubmission(e: any) {
        e.preventDefault();

        setProcessing(true);
        setErrors({});

        router.post('create-post', data,
        { onSuccess: (response) => {
            updatePostsOnCreate(response.props.new_post);
            toast.success('Post created successfully.');
            onOpenChange(false);
        }, onError: (errors) => {
            setErrors(errors);
            toast.error("Error submitting the form." + JSON.stringify(errors));
        },
        onFinish: () => {
            setProcessing(false);
        }
        });
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={()=>{onOpenChange(!isOpen)}}
        >
            <DialogContent className="w-full rounded-2xl sm:max-w-[800px] p-4 bg-secondary overflow-y-auto scrollbar max-h-[90vh]">
                <form
                onSubmit={postForEdit ? editSubmission : createSubmission}
                >
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
                            value={data.title}
                            onChange={(e) => setData({...data, title: e.target.value})}
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
                                    value={data.content}
                                    onChange={(e) => setData({...data, content: e.target.value})}
                                    className='w-full min-h-[200px] p-4 !bg-secondary text-primary border border-primary/10 focus:border-primary rounded-md overflow-y-auto scrollbar'
                                />

                                <InputError message={errors.content} />
                            </div>
                        </div>
                    </div>

                    {/* Group */}
                    {!postForEdit &&
                    <div className="grid gap-2">
                        <Label htmlFor='group' required>Group</Label>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className='w-full h-fit bg-secondary text-primary border font-normal justify-start outline-none'>{data.group ? groups.find((g: any) => g.id == data.group)?.name : "Select"}</Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="start" className='bg-secondary p-0'>
                                <DropdownMenuRadioGroup value={data.group} onValueChange={(value) => { setData({...data, group: value}) } }>
                                    <DropdownMenuRadioItem value="" className='w-full h-full px-4 ps-8 py-2 flex items-center text-primary text-left hover:opacity-100 hover:bg-primary/5 cursor-pointer '>Select</DropdownMenuRadioItem>
                                    {groups.map((g) => (
                                        <DropdownMenuRadioItem key={g.id} value={g.id} className='w-full h-full px-4 ps-8 py-2 flex items-center text-primary text-left hover:opacity-100 hover:bg-primary/5 cursor-pointer '>{g.name}</DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <InputError message={errors.group} />
                    </div>
                    }

                    {/* File picker */}
                    <div className="grid gap-2">
                        <Label>Files</Label>

                        <FileUploader
                            files={data.files}
                            setFiles={(files) => setData((prevData) => ({ ...prevData, files }))}
                            maxFiles={5}
                            allowMultiple={true}
                        />

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
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default PostCreateModal;