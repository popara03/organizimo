import { usePage } from '@inertiajs/react';
import axios from 'axios';
import React, { createContext, useState } from 'react'
import { toast } from 'sonner';

export const PostsContext = createContext<any>(null);

export type PostDTO = {
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

const PostsProvider = ({ children } : { children: React.ReactNode }) => {
    const {posts : postList} = usePage().props;
    const [posts, setPosts] = useState<any[]>(postList as any || []);
    
    // post change handlers
    const savePost = (postId: number) => {
        axios.post('/save-post/'+postId)
        .then(r => {
            const { is_saved } = r.data;
            setPosts((prev) => prev.map((post) => post.id === postId ? { ...post, is_saved } : post));
            toast.success(is_saved ? "Post saved successfully." : "Post unsaved successfully.");
        })
        .catch(e => {
            toast.error("Error saving post: "+e.response.data.error);
        });
    }

    const followPost = (postId: number) => {
        axios.post('/follow-post/'+postId)
        .then(r => {
            const { is_following } = r.data;
            setPosts((prev) => prev.map((post) => post.id === postId ? { ...post, is_following } : post));
            toast.success(is_following ? "Post followed successfully." : "Post unfollowed successfully.");
        })
        .catch(e => {
            toast.error("Error following post: "+e.response.data.error);
        });
    }

    const changeStatus = (postId: number, status: string) => {
        const isActive = status === "1" ? true : false;

        // if post is already in desired status, do nothing
        const post = posts.find((p) => p.id === postId);
        if (post.status == isActive) {
            toast.info('Post is already in the desired status.');
            return;
        }

        axios.post(`/change-post-status/${postId}`, { status: isActive })
        .then(() => {
            toast.success('Post status updated successfully.');

            setPosts(() => {
                return posts.map((post) =>
                    post.id === postId ? { ...post, status: isActive } : post
                );
            });
        })
        .catch(e => {
            toast.error('Error updating post status:', e.response.data.error);
        });
    }

    const deletePost = (id:number) => {
        axios.delete(`/delete-post/${id}`)
        .then(() => {
            setPosts(posts.filter((post: any) => post.id !== id));
            toast.success('Post deleted successfully.');
        })
        .catch(e => {
            toast.error('Failed to delete post. ' + e.response.data.error);
        });
    }

    const updatePostsOnCreate = (post: any) => {
        setPosts((prevPosts) => [post, ...prevPosts]);
    }

    const updatePostsOnEdit = (updatedPost: any) => {
        setPosts((prevPosts) => prevPosts.map((post) => post.id === updatedPost.id ? updatedPost : post));
    }

    return (
        <PostsContext.Provider value={{
            posts,
            setPosts,
            savePost,
            followPost,
            changeStatus,
            deletePost,
            updatePostsOnCreate,
            updatePostsOnEdit,
        }}>
        {children}
        </PostsContext.Provider>
    )
}

export default PostsProvider