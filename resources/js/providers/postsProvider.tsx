import axios from 'axios';
import React, { createContext, useState } from 'react'

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
    // dummy data for testing post
    const dummyPosts = [
        {
            id: 1,
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit 1. Lorem ipsum dolor sit amet consectetur adipisicing elit 1. Lorem ipsum dolor sit amet consectetur adipisicing elit 1.",
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            files: [
                { id: 3, name: "presentation.pdf", url: "documents/presentation.pdf", type: "document" },
                { id: 4, name: "instructions.pdf", url: "documents/instructions.pdf", type: "document" },
            ],
            status: true,
            createdAt: "2025-09-05 20:54:12",
            group: {
                id: 1,
                name: "Group 1",
                color: "lime",
            },
            author: {
                id: 1,
                name: "Author 1",
                image: null,
            },
            comments: [
                {
                    id: 1,
                    post_id: 1,
                    author: {
                        id: 1,
                        name: "Commenter 1",
                        image: null,
                    },
                    content: "This is a comment.",
                    created_at: "2025-09-05 20:54:12",
                    parent_id: null,
                    replies: [
                        {
                            id: 2,
                            post_id: 1,
                            author: {
                                id: 2,
                                name: "Commenter 2",
                                image: null,
                            },
                            content: "This is a reply.",
                            created_at: "2025-09-05 20:54:12",
                            parent_id: 1,
                            replies: [
                                {
                                    id: 3,
                                    post_id: 1,
                                    author: {
                                        id: 3,
                                        name: "Commenter 3",
                                        image: null,
                                    },
                                    content: "This is reply to a reply.",
                                    created_at: "2025-09-05 20:54:12",
                                    parent_id: 2,
                                    replies: [
                                        {
                                            id: 4,
                                            post_id: 1,
                                            author: {
                                                id: 4,
                                                name: "Commenter 4",
                                                image: null,
                                            },
                                            content: "This is a reply to a replyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy.",
                                            created_at: "2025-09-05 20:54:12",
                                            parent_id: 3,
                                            replies: [],
                                        }
                                    ],
                                },
                            ],
                        },
                    ],
                }
            ],
        },
    ];

    const [posts, setPosts] = useState<any[]>(dummyPosts);
    
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

    // post create/edit modal
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [postForEdit, setPostForEdit] = useState<any>(null);

    const openModalForCreate = () => {
        console.log("Open modal for create");
        setPostForEdit(null);
        setOpenModal(true);
    }

    const openModalForEdit = (post:any) => {
        setPostForEdit(post);
        setOpenModal(true);
    }

    return (
        <PostsContext.Provider value={{
            posts,
            savePost,
            followPost,
            changeStatus,
            deletePost,
            openModal,
            setOpenModal,
            openModalForCreate,
            openModalForEdit
        }}>
        {children}
        </PostsContext.Provider>
    )
}

export default PostsProvider