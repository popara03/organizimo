import { usePage } from '@inertiajs/react';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'
import { flushSync } from 'react-dom';

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
    const savePost = (postId: number, isSaved: boolean) => {
        // axios call here

        setPosts(() =>
            posts.map((post) =>
                post.id === postId ? { ...post, isSaved } : post
            )
        );
    }

    const followPost = (postId: number, isFollowing: boolean) => {
        // axios call here
        
        setPosts(() =>
            posts.map((post) =>
                post.id === postId ? { ...post, isFollowing } : post
            )
        );
    }

    const changeStatus = (postId: number, status: string) => {
        const isActive = status === "1" ? true : false;
        
        setPosts(() =>
            posts.map((post) =>
                post.id === postId ? { ...post, status: isActive } : post
            )
        );

        console.log("Change post status for id:", postId, " to ", isActive);
        return;

        // axios call here
        axios.post(`/update-post-status/${postId}`, { status: isActive })
        .then(response => {
                console.log('Post status updated successfully:', response.data);
                
                
            })
            .catch(error => {
                console.error('Error updating post status:', error);
            }
        );
    }

    const deletePost = async (id:number) => {
        console.log("Delete post with id:", id);
        return;

        const r = await axios.delete(`/delete-post/${id}`);
        
        if(r.status === 200){
            setPosts(posts.filter((post: any) => post.id !== id));
        }
        else {
            console.error('Failed to delete post. ' + r.data.message);
        }
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