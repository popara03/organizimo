import { useContext, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

import Post from '@/components/custom/post/post';
import Comment from '@/components/custom/post/comment';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PostsContext } from '@/providers/postsProvider';
import axios from 'axios';
import { toast } from 'sonner';
import { set } from 'date-fns';

type PostPreviewModalProps = {
    isOpen: boolean;
    togglePreview: (post:any) => void;
    post: any;
    openModalForEdit: (post:any) => void;
}

const PostPreviewModal = ({ isOpen, togglePreview, post, openModalForEdit } : PostPreviewModalProps) => {
    const { posts, setPosts } = useContext(PostsContext);
    const [newComment, setNewComment] = useState<string>("");

    const [replyingTo, setReplyingTo] = useState<any>(null);
    const handleReply = (comment:any) => {
        setReplyingTo(comment);
    }

    const submitComment = (content: string, replyingTo: any) => {
        const data = {
            content,
            parent_id: replyingTo?.id || null,
            post_id: post.id,
        };

        axios.post('/submit-comment', data)
        .then(r => {
            // update posts context, take care of parent and child comments too
            const comment = r.data.comment;
            const updatedPosts = posts.map((p: any) => {
                if (p.id === post.id) {
                    return {
                        ...p,
                        comments: [comment, ...p.comments]
                    };
                }
                return p;
            });

            setPosts(updatedPosts);
            
            toast.success("Comment submitted successfully");
            
            setNewComment("");
            setReplyingTo(null);
        })
        .catch(e => {
            toast.error("Error submitting comment: " + e.response.data.error);
        });
    }

    return (
    <Dialog
    open={isOpen}
    onOpenChange={togglePreview}
    >
      <DialogContent hideClose className='w-full h-full max-w-11/12 max-h-10/12 md:max-h-11/12 p-0 flex flex-col gap-0 bg-primary overflow-y-auto scrollbar'>
        <DialogTitle className='hidden'>
            <DialogDescription></DialogDescription>
        </DialogTitle>
        
        <Post
        post={post}
        isPreviewed={true}
        className='flex-1'
        openModalForEdit={openModalForEdit}
        />

        {/* comments */}
        <div className="p-4 flex flex-col gap-4">
            {/* comment input */}
            <div className={`w-full flex flex-col gap-2 px-4 py-2 bg-secondary rounded-md ${post.status == false ? "opacity-25 pointer-events-none" : ""}`}>
                { replyingTo && 
                <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <p>
                        Replying to <span className="font-semibold">@{replyingTo.author.name}</span>
                    </p>

                    <Button
                    variant={'default'}
                    className='h-fit px-2 py-1  text-xs bg-primary text-secondary'
                    onClick={() => { setReplyingTo(null); }}>
                        Cancel
                    </Button>
                </div>
                }
                
                <div className="flex gap-2">
                    <Input
                    placeholder="Write a comment"
                    className="
                    p-0
                    border-0 border-b border-primary rounded-none
                    focus:!ring-0
                    "
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)} />

                    <Button
                    variant={'ghost'}
                    className='!p-0'
                    onClick={() => {
                        submitComment(newComment, replyingTo);
                    }}
                    disabled={newComment.trim() === ""}
                    >
                        <svg className='size-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 11V13H21V14H20V15H18V16H16V17H15V18H13V19H11V20H10V21H8V22H6V23H3V22H2V2H3V1H6V2H8V3H10V4H11V5H13V6H15V7H16V8H18V9H20V10H21V11H22Z" fill="black"/>
                        </svg>
                    </Button>
                </div>
            </div>

            {post && post.comments && post.comments.length > 0 && (
                post.comments.map((comment: any) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        onReply={handleReply}
                    />
                ))
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostPreviewModal