import { Button } from '@/components/ui/button';

export type Comment = {
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
    replies?: Comment[];
}

const Comment = ({ comment, onReply, depth = 0, parentAuthorName } : { comment: Comment, onReply: (comment: Comment) => void, depth?: number, parentAuthorName?: string } ) => {
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
                    {new Date(comment.created_at?.replace(" ", "T")).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
        </div>

        <Button 
        variant={'ghost'} 
        className='p-0 font-bold'
        onClick={() => {
            onReply(comment);
        }}>
            Reply
        </Button>
      </div>
      
      {/* content */}
      <p className='text-sm break-words'>
        {depth > 1 && parentAuthorName && <span className='font-semibold'>@{parentAuthorName} </span>}
        {comment.content}
      </p>
      
      {/* replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className={`flex flex-col gap-12`}>
          {comment.replies.map((reply) => (
            <Comment
            key={reply.id}
            comment={reply}
            onReply={onReply}
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