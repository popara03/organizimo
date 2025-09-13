import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

import { Button } from '../../ui/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { FileIcon } from 'lucide-react';

type Post = {
    id: number;
    title: string;
    content: string;
    files: [
        {
            id: number;
            url: string;
            name: string;
            type: string;
        }
    ];
    status: boolean;
    createdAt: string;
    isSaved: boolean;
    isFollowing: boolean;
    group: {
        id: number;
        name: string;
        color: string;
    };
    author: {
        id: number;
        name: string;
        image: string;
    };
    comments: Array<{
        id: number;
        content: string;
        author: {
            id: number;
            name: string;
            image: string;
        };
        parentId: number | null;
        createdAt: string;
    }>;
}

const Post = (
    {
        post,
        onSave,
        onFollow,
        onDelete,
        onStatusChange,
        togglePreview,
        openModalForEdit,
    }:
    {
        post: Post,
        onSave: (postId: number, isSaved: boolean) => void,
        onFollow: (postId: number, isFollowing: boolean) => void,
        onDelete: (id: number) => void,
        onStatusChange: (postId: number, status: string) => void,
        togglePreview: (post: any) => void,
        openModalForEdit: (post: any) => void,
    }) => {

    const {props} = usePage();
    const activeUser : any = props.active_user;

    const [postStatus, setPostStatus] = useState(post.status ? '1' : '0');

    return (
    <div className='relative w-full max-w-[450px] max-h-[300px] p-4 flex flex-col gap-2 bg-primary rounded-md shadow-md overflow-hidden'>
        {/* header */}
        <div className="relative pb-2 flex flex-col-reverse sm:flex-row items-center gap-4 sm:border-b border-secondary/10">
            {/* author details and title */}
            <div className="w-full flex items-center gap-2">
                { post?.author?.image ?
                    <img src={'/storage/'+post.author.image} alt={post.author.name} className="size-9 rounded-full" />
                :
                    <img src="/icons/user.svg" alt={post.author.name} className="size-9 rounded-full bg-accent-lime"/>
                }

                <div className="flex flex-col text-secondary overflow-hidden">
                    <span className="text-sm font-bold" style={{ color: post.group.color }}>{post.author.name} | {post.group.name}</span>
                    
                    <Button
                    variant={"link"}
                    className="p-0 h-auto text-base font-bold text-secondary line-clamp-1 truncate cursor-pointer !no-underline"
                    onClick={() => togglePreview(post)}
                    >
                        {post.title}
                    </Button>
                </div>
            </div>

            {/* post options */}
            <div className="relative sm:absolute top-0 right-0 w-full sm:w-fit h-full sm:ps-8 flex items-center justify-around sm:justify-start gap-4 bg-gradient-to-r from-transparent via-5% via-primary to-primary border-b sm:border-0 border-secondary/10 pb-2 sm:pb-2">
                {/* save post */}
                <Button className='p-0 bg-transparent' asChild onClick={() => { onSave(post.id, post.isSaved ? false : true); }}>
                    <svg className={`w-6 h-6 ${post.isSaved ? "*:fill-accent-blue" : "*:fill-white"}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2V23H19V22H18V21H17V20H16V19H15V18H14V17H13V16H11V17H10V18H9V19H8V20H7V21H6V22H5V23H4V2H5V1H19V2H20Z" fill="white"/>
                    </svg>
                </Button>

                {/* follow post */}
                <Button className='p-0 bg-transparent' asChild onClick={() => { onFollow(post.id, post.isFollowing ? false : true); }}>
                    <svg className={`w-6 h-6 ${post.isFollowing ? "*:fill-accent-purple" : "*:fill-white"}`} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 26.6667V29.3333H18.6667V30.6667H13.3333V29.3333H12V26.6667H20Z" fill="#EEEEEE"/>
                    <path d="M29.3333 22.6667V24H28V25.3333H3.99996V24H2.66663V22.6667H3.99996V21.3333H5.33329V18.6667H6.66663V10.6667H7.99996V8H9.33329V6.66667H10.6666V5.33333H13.3333V4H14.6666V1.33333H17.3333V4H18.6666V5.33333H21.3333V6.66667H22.6666V8H24V10.6667H25.3333V18.6667H26.6666V21.3333H28V22.6667H29.3333Z" fill="#EEEEEE"/>
                    </svg>
                </Button>
                
                {/* show options only to admin and post author */}
                { (activeUser.role_id == 2 || activeUser.id === post.author.id) && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className='p-0 bg-transparent' asChild>
                            <svg className='w-6 h-6 *:!fill-secondary' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 3V5H14V6H13V7H11V6H10V5H9V3H10V2H11V1H13V2H14V3H15Z" fill="white"/>
                            <path d="M14 11H15V13H14V14H13V15H11V14H10V13H9V11H10V10H11V9H13V10H14V11Z" fill="white"/>
                            <path d="M14 19H15V21H14V22H13V23H11V22H10V21H9V19H10V18H11V17H13V18H14V19Z" fill="white"/>
                            </svg>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className='bg-secondary *:text-primary p-0'>
                        {/* change status */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className='p-2 border-b rounded-none border-primary/10 hover:opacity-75 cursor-pointer text-inherit text-base'>
                                Status
                            </DropdownMenuSubTrigger>

                            <DropdownMenuPortal>
                                <DropdownMenuSubContent className='bg-secondary'>
                                    <DropdownMenuRadioGroup value={postStatus} onValueChange={(value) => { setPostStatus(value); onStatusChange(post.id, value); }}>
                                        <DropdownMenuRadioItem value='1' className='w-full h-full px-4 ps-8 py-2 flex items-center text-primary text-left hover:opacity-100 hover:bg-primary/5 cursor-pointer '>Active</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value='0' className='w-full h-full px-4 ps-8 py-2 flex items-center text-primary text-left hover:opacity-100 hover:bg-primary/5 cursor-pointer '>Closed</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        {/* edit */}
                        <DropdownMenuItem
                        onClick={() => openModalForEdit(post)}
                        className='p-2 border-b rounded-none border-primary/10 hover:opacity-75 cursor-pointer text-inherit text-base'
                        >
                            Edit
                        </DropdownMenuItem>

                        {/* delete */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <div className='p-2 rounded-none border-b border-primary/10 hover:opacity-75 cursor-pointer text-inherit'>Delete</div>
                            </AlertDialogTrigger>
                            
                            <AlertDialogContent className='bg-secondary'>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>

                                    <AlertDialogDescription>
                                    This action can't be undone, it will permanently delete selected data from the server.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                                    <AlertDialogAction onClick={() => onDelete(post.id)}>
                                    Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
                )}
            </div>
        </div>

        {/* body */}
        <div className='flex flex-col gap-4 text-secondary'>
            <span className="text-sm text-inherit line-clamp-10">{post.content}</span>

            <div className="flex flex-col gap-4">
                {
                    post.files && post.files.length > 0 && post.files.some(file => file.type === "image") && (
                    <div className='w-full flex flex-wrap gap-2'>
                        { post.files.map((file) => (
                            file.type === "image" && (
                                <img key={file.id} src={`/storage/${file.url}`} alt={file.name} className="w-1/4 h-auto aspect-square rounded-md object-cover" />
                            )
                        ))}
                    </div>
                    )
                }

                {
                    post.files && post.files.length > 0 && post.files.some(file => file.type === "document") && (
                    <div className='w-full flex flex-col gap-2'>
                        { post.files.map((file) => (
                            file.type !== "image" && (
                                <Link key={file.id} href={`/storage/${file.url}`} target="_blank" className="w-fit flex items-center gap-2">
                                    <FileIcon className='size-4 *:fill-accent-blue' />
                                    <span className='text-sm text-secondary'>{file.name}</span>
                                </Link>
                            )
                        ))}
                    </div>
                    )
                }
            </div>
        </div>

        {/* footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 pt-8 flex justify-between items-center gap-4 bg-gradient-to-b from-transparent via-25% via-primary to-primary">
            <Button
            className="!p-0 !h-fit"
            onClick={() => togglePreview(post)}>
                <div className="flex items-center gap-2">
                    <svg className='size-6' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 8V6H21V5H20V4H18V3H15V2H9V3H6V4H4V5H3V6H2V8H1V14H2V16H3V18H2V19H1V21H6V20H7V19H9V20H15V19H18V18H20V17H21V16H22V14H23V8H22ZM16 13V12H15V10H16V9H18V10H19V12H18V13H16ZM10 12V10H11V9H13V10H14V12H13V13H11V12H10ZM8 9V10H9V12H8V13H6V12H5V10H6V9H8Z" fill="white"/>
                    </svg>
                    <span className="text-sm text-secondary font-bold">{post.comments.length}</span>
                </div>
            </Button>

            <span className="text-sm text-secondary font-bold">
                {new Date(post.createdAt).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </span>
        </div>
    </div>
  )
}

export default Post