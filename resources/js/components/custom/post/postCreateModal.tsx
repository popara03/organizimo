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
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
// mergde these imports
import { Heading1, Heading2, Heading3, LoaderCircle, Underline, Bold, Italic, Strikethrough, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link as LinkIcon, Unlink, Undo, Redo } from "lucide-react";
import { toast } from 'sonner';

import { Editor, useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { Toggle } from '@radix-ui/react-toggle';

type PostModalProps = {
    isOpen: boolean,
    onIsOpenChange: (open: boolean) => void,
    postForEdit: any,
    groups: any[],
    activeGroupId?: number | null,
    onCreate: (group: any) => void,
    onUpdate: (group: any) => void
}

function MenuBar({ editor }: { editor: Editor }) {
    if (!editor) {
        return null
    }

    const Options = [
    {
      icon: (
        <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
          <Heading1 className="size-6" />
        </div>
      ),
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: (
        <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
          <Heading2 className="size-6" />
        </div>
      ),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: (
        <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
          <Heading3 className="size-6" />
        </div>
      ),
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: (
        <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
          <Bold className="size-6" />
        </div>
      ),
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: (
        <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
          <Italic className="size-6" />
        </div>
      ),
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: (
        <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
          <Strikethrough className="size-6" />
        </div>
      ),
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: (
        <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
          <Underline className="size-6" />
        </div>
      ),
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      pressed: editor.isActive("underline"),
    },
    {
      icon: (
        <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
          <AlignLeft className="size-6" />
        </div>
      ),
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: (
        <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
          <AlignCenter className="size-6" />
        </div>
      ),
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: (
        <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
          <AlignRight className="size-6" />
        </div>
      ),
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: (
        <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
          <List className="size-6" />
        </div>
      ),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: (
        <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
          <ListOrdered className="size-6" />
        </div>
      ),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
        icon: (
          <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
            <LinkIcon className="size-6" />
          </div>
        ),
        onClick: (e: any) => editor.chain().focus().setLink({ href: e.currentTarget.value, target: "_blank" }).run(),
        pressed: editor.isActive("link"),
    },
    {
        icon: (
          <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
            <Unlink className="size-6" />
            </div>
        ),
        onClick: () => editor.chain().focus().unsetLink().run(),
        pressed: editor.isActive("link"),
    },
    {
        icon: (
            <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
                <Undo className="size-6" />
            </div>
        ),
        onClick: () => editor.chain().focus().undo().run(),
        pressed: editor.isActive("undo"),
    },
    {
        icon: (
            <div className="p-1 flex justify-center items-center rounded-md bg-tertiary">
                <Redo className="size-6" />
            </div>
        ),
        onClick: () => editor.chain().focus().redo().run(),
        pressed: editor.isActive("redo"),
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
        {Options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.pressed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  )
}

const PostCreateModal = ({isOpen, onIsOpenChange, postForEdit, groups, activeGroupId, onCreate, onUpdate}: PostModalProps) => {
    // Content
    const [content, setContent] = useState<string>(postForEdit?.content || 'KURAC');

    const editor = useEditor({
        editorProps: {
            attributes: {
                class: 'bg-primary *:!text-secondary w-full h-56 p-4 rounded-md overflow-y-auto scrollbar focus:text-secondary',
            },
        },
        extensions: [
            StarterKit.configure({
                link: {
                    openOnClick: false,
                    HTMLAttributes: {
                        class: 'text-blue-500 underline',
                    },
                },
                heading: {
                    levels: [1, 2, 3],
                    HTMLAttributes: {
                        class: 'text-secondary font-bold mt-0.5 mb-2',
                    },
                },
                bulletList: {
                    HTMLAttributes: { class: 'text-secondary list-disc ml-6 mb-2' },
                },
                orderedList: {
                    HTMLAttributes: { class: 'text-secondary list-decimal ml-6 mb-2' },
                },
                listItem: {
                    HTMLAttributes: { class: 'mb-1' },
                },
                paragraph: {
                    HTMLAttributes: { class: 'text-secondary mb-2' },
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content,
        onUpdate: (content: any) => {
            setContent(content);
        },
    });

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
                                            defaultValue={postForEdit?.title || ''} />
                                        <InputError message={errors.title} />
                                    </div>

                                    {/* Content */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="content" required>Content</Label>
                                        <div className="flex flex-col gap-4">
                                            <div className="w-full flex flex-col gap-2">
                                                {/* editor */}
                                                <MenuBar editor={editor} />
                                                <EditorContent 
                                                editor={editor} 
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