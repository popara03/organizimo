import { usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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

export type PostComment = {
    id: number;
    post_id: number;
    author: {
        id: number;
        name: string;
        image: string;
    };
    content: string;
    created_at: string;
    parent_id?: number;
    replies?: PostComment[];
}

const Comment = ({ comment, onReply, onDelete, depth = 0, parentAuthorName } : { comment: PostComment, onReply: (comment: PostComment) => void, onDelete: (commentId: number) => void, depth?: number, parentAuthorName?: string } ) => {
    const activeUser:any = usePage().props.active_user;

    return (
    <div className={`w-full ${depth <= 1 ? "p-4 gap-2" : "gap-2 border-t border-primary/5 pt-2"} flex flex-col ${depth === 0 ? "bg-secondary" : "bg-tertiary"} rounded-md`}>
      {/* header */}
      <div className='flex items-start justify-between'>
        <div className="flex items-center gap-2">
            { comment.author.image ?
                <img src={'/storage/'+comment.author.image} alt={comment.author.name} className="size-9 rounded-full" />
            :
                <img src="/icons/user.svg" alt={comment.author.name} className="size-9 rounded-full bg-accent-lime"/>
            }

            <div className='flex flex-col'>
                <p className='font-semibold'>{comment.author.name}</p>

                <p className='text-xs text-gray-500'>
                    {new Date(comment.created_at).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
        </div>
        
        <div className='flex items-center gap-4'>
          <Button 
          variant={'ghost'} 
          className='p-0 font-bold'
          onClick={() => {
              onReply(comment);
          }}>
              Reply
          </Button>

          {/* comment options */}
          <div className={`w-full sm:w-fit h-full flex items-center justify-around sm:justify-start gap-4 border-b sm:border-none border-secondary/10 pb-2 sm:pb-0`}>
              {/* show options only to admin and post author */}
              { (activeUser.role_id == 2 || activeUser.id === comment.author.id) && (
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button className='p-0 bg-transparent' asChild>
                          <svg className='size-5 *:!fill-primary' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 3V5H14V6H13V7H11V6H10V5H9V3H10V2H11V1H13V2H14V3H15Z" fill="white"/>
                          <path d="M14 11H15V13H14V14H13V15H11V14H10V13H9V11H10V10H11V9H13V10H14V11Z" fill="white"/>
                          <path d="M14 19H15V21H14V22H13V23H11V22H10V21H9V19H10V18H11V17H13V18H14V19Z" fill="white"/>
                          </svg>
                      </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className='bg-secondary *:text-primary p-0'>
                      {/* edit */}
                      {/* <DropdownMenuItem
                      onClick={() => {}}
                      className='p-2 border-b rounded-none border-primary/10 hover:opacity-75 cursor-pointer text-inherit text-base'
                      >
                          Edit
                      </DropdownMenuItem> */}

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

                                  <AlertDialogAction onClick={() => onDelete(comment.id)}>
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
      </div>
      
      {/* content */}
      <p className='text-sm break-words'>
        {depth > 1 && parentAuthorName && <span className='font-semibold'>@{parentAuthorName} </span>}
        {comment.content}
      </p>
      
      {/* replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className={`flex flex-col gap-2`}>
          {comment.replies.map((reply : PostComment) => (
            <Comment
            key={reply.id}
            comment={reply}
            onReply={onReply}
            onDelete={onDelete}
            depth={depth + 1}
            parentAuthorName={comment.author.name}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Comment