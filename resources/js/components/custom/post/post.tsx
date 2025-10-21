import { useContext, useState } from 'react';
import { usePage } from '@inertiajs/react';
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
import PostPreviewModal from './postPreviewModal';
import { PostsContext } from '@/providers/postsProvider';
import { PostComment } from './comment';

type PostFile = {
    id: number;
    name: string;
    type: string;
    path: string;
}

type PostAuthor = {
    id: number;
    name: string;
    image?: string | null;
}

type PostGroup = {
    id: number;
    name: string;
    color: string;
}

type PostDTO = {
    id: number;
    title: string;
    content: string;
    files: PostFile[];
    status: boolean;
    created_at: string;
    is_saved: boolean;
    is_following: boolean;
    group: PostGroup;
    author: PostAuthor;
    comments: PostComment[];
}

const Post = ({ post, isPreviewed, openModalForEdit, className }: { post: PostDTO, isPreviewed?: boolean, openModalForEdit: (post: PostDTO) => void, className?: string }) => {
    // context
    const ctx = useContext(PostsContext);
    const { savePost, followPost, changeStatus, deletePost, setLightboxIndex, setLightboxSlides } = ctx;

    // active user
    const {props} : any = usePage();
    const activeUser = props.active_user;

    // post preview
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
    const togglePreview = (value?: boolean) => {
        setIsPreviewOpen(value !== undefined ? value : !isPreviewOpen);
    }

    function countAllComments(post: PostDTO): number {
        let count = 0;

        count += post.comments.length;

        function countReplies(comment: any): number {
            let count = 0;
            
            if (comment.replies) {
                count += comment.replies.length;

                comment.replies.forEach((reply:any) => {
                    count += countReplies(reply);
                });
            }
            
            return count;
        }

        post.comments.forEach((comment: any) => {
            count += countReplies(comment);
        });

        return count;
    }

    return (
    <>
        <div className={`relative w-full h-full max-w-[460px] min-h-[300px] max-h-[300px] p-4 flex flex-col gap-2 bg-primary rounded-md shadow-md overflow-hidden ${className} ${isPreviewed && 'max-w-full min-h-full max-h-full gap-4 shadow-none'}`}>
            {/* header */}
            <div className="relative sm:pb-2 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2 sm:border-b border-secondary/10">
                {/* author details and title */}
                <div className="min-w-0 flex items-center gap-2">
                    { post?.author?.image ?
                        <img src={'/storage/'+post.author.image} alt={post.author.name} className="w-10 h-10 flex-shrink-0 object-cover object-center rounded-full" />
                    :
                        <img src="/icons/user.svg" alt={post.author.name} className="w-10 h-10 flex-shrink-0 object-cover object-[50%_0.2rem] rounded-full bg-accent-lime"/>
                    }

                    <div className="min-w-0 flex flex-col text-secondary ">
                        <span className="text-sm font-bold" style={{ color: post.group.color }}>{post.author.name} | {post.group.name}</span>
                        
                        <Button
                        variant={"link"}
                        className={`!h-auto !p-0 block text-base font-bold text-secondary !text-left !no-underline ${isPreviewed ? 'whitespace-normal hover:opacity-100 pointer-events-none' : 'line-clamp-1 truncate'}`}
                        onClick={() => !isPreviewed && togglePreview()}
                        >
                            {post.title}
                        </Button>

                        {post.status == false && (
                        <div className="w-fit text-accent-red/50 text-xs font-bold uppercase">
                            Discussion closed
                        </div>
                    )}
                    </div>
                </div>

                {/* post options */}
                <div className={`w-full sm:w-fit h-full flex items-center justify-around sm:justify-start gap-4 border-b sm:border-none border-secondary/10 pb-2 sm:pb-0`}>
                    {/* save post */}
                    <Button className='p-0 bg-transparent' asChild onClick={() => { savePost(post.id) }}>
                        <svg className={`w-6 h-6 ${post.is_saved ? "*:fill-accent-blue" : "*:fill-white"}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2V23H19V22H18V21H17V20H16V19H15V18H14V17H13V16H11V17H10V18H9V19H8V20H7V21H6V22H5V23H4V2H5V1H19V2H20Z" fill="white"/>
                        </svg>
                    </Button>

                    {/* follow post */}
                    {post.author.id != activeUser.id && (
                        <Button className='p-0 bg-transparent' asChild onClick={() => { followPost(post.id, post.is_following ? false : true); }}>
                            <svg className={`w-6 h-6 ${post.is_following ? "*:fill-accent-purple" : "*:fill-white"}`} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 26.6667V29.3333H18.6667V30.6667H13.3333V29.3333H12V26.6667H20Z" fill="#EEEEEE"/>
                            <path d="M29.3333 22.6667V24H28V25.3333H3.99996V24H2.66663V22.6667H3.99996V21.3333H5.33329V18.6667H6.66663V10.6667H7.99996V8H9.33329V6.66667H10.6666V5.33333H13.3333V4H14.6666V1.33333H17.3333V4H18.6666V5.33333H21.3333V6.66667H22.6666V8H24V10.6667H25.3333V18.6667H26.6666V21.3333H28V22.6667H29.3333Z" fill="#EEEEEE"/>
                            </svg>
                        </Button>
                    )}
                    
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
                                        <DropdownMenuRadioGroup value={post.status ? "1" : "0"} onValueChange={(value) => { changeStatus(post.id, value); }}>
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

                                        <AlertDialogAction onClick={() => {
                                            deletePost(post.id);
                                            togglePreview(false);
                                        }}>
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
            <div className='flex-1 flex flex-col gap-4 text-secondary'>
                <span className="text-sm text-inherit line-clamp-10">{post.content}</span>

                { post.files && post.files.length > 0 && post.files.some(file => file.type === "image") && (
                    <div className='w-full flex flex-wrap gap-2'>
                        { post.files.filter(file => file.type === "image").map((file, i) => (
                                <img
                                    key={file.id}
                                    src={`/storage/${file.path}`}
                                    alt={file.name}
                                    onClick={() => {
                                        setLightboxIndex(i);
                                        setLightboxSlides(post.files.filter(f => f.type === "image").map(f => ({ src: `/storage/${f.path}` })));
                                    }}
                                    className={`w-20 h-auto aspect-square rounded-md object-cover ${isPreviewed && 'w-48'} cursor-pointer`}
                                />
                            )
                        )}
                    </div>
                )}

                { post.files && post.files.length > 0 && post.files.some(file => file.type === "document") && (
                    <div className='w-full flex flex-col gap-2'>
                        { post.files.filter(file => file.type === "document").map((file) => (
                            <a key={file.id} href={`/storage/${file.path}`} target="_blank" className="w-fit flex items-center gap-2">
                                <FileIcon className='size-4 *:fill-accent-blue' />
                                <span className='text-sm text-secondary'>{file.name}</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* footer */}
            <div className={`absolute bottom-0 left-0 w-full p-4 pt-8 flex justify-between items-center gap-4 bg-gradient-to-b from-transparent via-25% via-primary to-primary ${isPreviewed && '!relative !p-0'}`}>
                <Button
                className={`!p-0 !h-fit ${isPreviewed && 'pointer-events-none'}`}
                onClick={() => togglePreview()}>
                    <div className="flex items-center gap-2">
                        <svg className='size-6' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 8V6H21V5H20V4H18V3H15V2H9V3H6V4H4V5H3V6H2V8H1V14H2V16H3V18H2V19H1V21H6V20H7V19H9V20H15V19H18V18H20V17H21V16H22V14H23V8H22ZM16 13V12H15V10H16V9H18V10H19V12H18V13H16ZM10 12V10H11V9H13V10H14V12H13V13H11V12H10ZM8 9V10H9V12H8V13H6V12H5V10H6V9H8Z" fill="white"/>
                        </svg>
                        <span className="text-sm text-secondary font-bold">{countAllComments(post)}</span>
                    </div>
                </Button>

                <span className="text-sm text-secondary font-bold">
                    {new Date(post.created_at).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>
        </div>

        {/* post preview modal */}
        <PostPreviewModal
        isOpen={isPreviewOpen}
        togglePreview={togglePreview}
        post={post}
        openModalForEdit={openModalForEdit}
        />
    </>
  )
}

export default Post