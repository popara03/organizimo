import { useEffect, useState } from 'react';

import Sidebar from '@/components/custom/fixed/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, usePage } from '@inertiajs/react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ChevronDownIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"

import axios from 'axios';

import Post from '@/components/custom/post/post';
import PostPreviewModal from '@/components/custom/post/postPreviewModal';

export default function Dashboard() {
    // data
    const {props} : any = usePage();
    const groups = props.groups;
    const users = props.users;

    // dummy data for testing post
    const dummyPosts = [
        {
            id: 1,
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit 1",
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
            comments: [],
        },
        {
            id: 2,
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit 2",
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            files: [
                { id: 1, name: "image1.jpg", url: "images/ZczmmKp4GBTxgc47Dl0kTYA9JHsLTKnJY2iOEIUL.jpg", type: "image" },
                { id: 2, name: "cv.pdf", url: "documents/cv.pdf", type: "document" },
                { id: 3, name: "cv.pdf", url: "documents/cv.pdf", type: "document" },
            ],
            status: true,
            createdAt: "2025-09-05 20:54:12",
            group: {
                id: 2,
                name: "Group 2",
                color: "red",
            },
            author: {
                id: 2,
                name: "Author 2",
                image: null,
            },
            comments: [],
        },
        {
            id: 4,
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit 2",
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            files: [
                { id: 1, name: "image1.jpg", url: "images/ZczmmKp4GBTxgc47Dl0kTYA9JHsLTKnJY2iOEIUL.jpg", type: "image" },
                { id: 2, name: "image2.png", url: "images/ZczmmKp4GBTxgc47Dl0kTYA9JHsLTKnJY2iOEIUL.jpg", type: "image" },
                { id: 3, name: "cv.pdf", url: "documents/cv.pdf", type: "document" },
                { id: 4, name: "cv.pdf", url: "documents/cv.pdf", type: "document" },
            ],
            status: true,
            createdAt: "2025-09-05 20:54:12",
            group: {
                id: 2,
                name: "Group 2",
                color: "red",
            },
            author: {
                id: 2,
                name: "Author 2",
                image: null,
            },
            comments: [],
        },
        {
            id: 3,
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit 2",
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            files: [
                { id: 1, name: "image1.jpg", url: "images/ZczmmKp4GBTxgc47Dl0kTYA9JHsLTKnJY2iOEIUL.jpg", type: "image" },
                { id: 2, name: "image2.png", url: "images/ZczmmKp4GBTxgc47Dl0kTYA9JHsLTKnJY2iOEIUL.jpg", type: "image" },
                { id: 3, name: "cv.pdf", url: "documents/cv.pdf", type: "document" },
                { id: 4, name: "cv.pdf", url: "documents/cv.pdf", type: "document" },
            ],
            status: true,
            createdAt: "2025-09-05 20:54:12",
            group: {
                id: 2,
                name: "Group 2",
                color: "red",
            },
            author: {
                id: 2,
                name: "Author 2",
                image: null,
            },
            comments: [],
        },
    ];
    const [posts, setPosts] = useState<any[]>(dummyPosts);

    // filters
    const [activeGroup, setActiveGroup] = useState<number | null>(null);
    
    const [personalization, setPersonalization] = useState<"my-posts" | "saved" | "following" | null>(null);
    
    const [keyword, setKeyword] = useState<string>('');
    
    const [startDate, setStartDate] = useState<any>();
    const [isStartDateOpen, setIsStartDateOpen] = useState<boolean>(false);

    const [endDate, setEndDate] = useState<any>();
    const [isEndDateOpen, setIsEndDateOpen] = useState<boolean>(false);

    const [status, setStatus] = useState<any>(null);

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    // filter data object
    const [filterData, setFilterData] = useState<any>({
        group: activeGroup,
        personalization,
        keyword,
        startDate,
        endDate,
        status,
        selectedUsers,
    });
    useEffect(() => {
        const newFilterData = {
            group: activeGroup,
            personalization,
            keyword,
            startDate,
            endDate,
            status,
            selectedUsers,
        };
        handleFiltering(newFilterData);
    }, [activeGroup, personalization, keyword, startDate, endDate, status, selectedUsers]);

    const handleFiltering = (filterData:any) => {
        console.log(filterData)
        return;

        axios.post('/dashboard/filter', filterData)
        .then(response => {
            setPosts(response.data);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    // reset filters
    const [resetSignal, setResetSignal] = useState(false);
    const resetFilters = () => {
        setActiveGroup(null);
        setPersonalization(null);
        setKeyword('');
        setStartDate(null);
        setEndDate(null);
        setStatus(null);
        setSelectedUsers([]);
        setResetSignal(!resetSignal);   //trigger reset signal for multi-select
    }

    // post change handlers
    const handlePostSaved = (postId: number, isSaved: boolean) => {
        // axios call here

        setPosts(() =>
            posts.map((post) =>
                post.id === postId ? { ...post, isSaved } : post
            )
        );
    }

    const handlePostFollowing = (postId: number, isFollowing: boolean) => {
        // axios call here
        
        setPosts(() =>
            posts.map((post) =>
                post.id === postId ? { ...post, isFollowing } : post
            )
        );
    }

    const handlePostStatusChange = (postId: number, status: string) => {
        const isActive = status === "1" ? true : false;

        return;

        // axios call here
        axios.post(`/update-post-status/${postId}`, { status: isActive })
        .then(response => {
                console.log('Post status updated successfully:', response.data);
                
                setPosts(() =>
                    posts.map((post) =>
                        post.id === postId ? { ...post, status: isActive } : post
                    )
                );
            })
            .catch(error => {
                console.error('Error updating post status:', error);
            }
        );
    }

    const handlePostDelete = async (id:number) => {
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

    // post preview toggler
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
    const [postForPreview, setPostForPreview] = useState<any>(null);
    
    const openPreview = (post:any) => {
        setPostForPreview(post);
        setIsPreviewOpen(!isPreviewOpen);
    }

    // post edit modal
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [postForEdit, setPostForEdit] = useState<any>(null);

    const openModalForEdit = (post:any) => {
        setPostForEdit(post);
        setOpenModal(true);
    }

    return (
    <div className="flex-1 px-4 ps-12 flex flex-col">
        <Head title="Dashboard" />

        <Sidebar data={groups} groupState={activeGroup} setGroupState={setActiveGroup} />

        {/* filters */}
        <div className="w-full pb-8 flex flex-col items-center gap-8 border-b border-primary/10">
            {/* filter buttons */}
            <div className="w-full flex flex-wrap md:justify-center gap-4">
                <Button className={`flex gap-2 items-center ${personalization === "my-posts" && "opacity-50"}`} onClick={() => { setPersonalization(personalization === "my-posts" ? null : "my-posts");}}>
                    <svg className='w-6 h-6 *:!fill-accent-lime' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 1H2V2H3V1Z" fill="white"/>
                    <path d="M4 2H3V3H4V2Z" fill="white"/>
                    <path d="M5 3H4V4H5V3Z" fill="white"/>
                    <path d="M2 16H1V17H2V16Z" fill="white"/>
                    <path d="M3 15H2V16H3V15Z" fill="white"/>
                    <path d="M4 14H3V15H4V14Z" fill="white"/>
                    <path d="M23 16H22V17H23V16Z" fill="white"/>
                    <path d="M22 15H21V16H22V15Z" fill="white"/>
                    <path d="M21 14H20V15H21V14Z" fill="white"/>
                    <path d="M22 1H21V2H22V1Z" fill="white"/>
                    <path d="M21 2H20V3H21V2Z" fill="white"/>
                    <path d="M20 3H19V4H20V3Z" fill="white"/>
                    <path d="M3 8H1V9H3V8Z" fill="white"/>
                    <path d="M15 18V21H14V22H13V23H11V22H10V21H9V18H15Z" fill="white"/>
                    <path d="M19 5H18V4H17V3H16V2H14V1H10V2H8V3H7V4H6V5H5V7H4V11H5V13H6V14H7V15H8V16H9V17H15V16H16V15H17V14H18V13H19V11H20V7H19V5ZM7 7H8V6H9V5H10V4H13V5H10V6H9V7H8V9H7V7Z" fill="white"/>
                    <path d="M23 8H21V9H23V8Z" fill="white"/>
                    </svg>

                    <span className='font-jersey text-accent-lime'>My posts</span>
                </Button>

                <Button className={`flex gap-2 items-center ${personalization === "saved" && "opacity-50"}`} onClick={() => { setPersonalization(personalization === "saved" ? null : "saved");}}>
                    <svg className='w-6 h-6 *:!fill-accent-blue' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2V23H19V22H18V21H17V20H16V19H15V18H14V17H13V16H11V17H10V18H9V19H8V20H7V21H6V22H5V23H4V2H5V1H19V2H20Z" fill="white"/>
                    </svg>

                    <span className='font-jersey text-accent-blue'>Saved</span>
                </Button>

                <Button className={`flex gap-2 items-center ${personalization === "following" && "opacity-50"}`} onClick={() => { setPersonalization(personalization === "following" ? null : "following");}}>
                    <svg className='w-6 h-6 *:!fill-accent-purple' viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 26.6667V29.3333H18.6667V30.6667H13.3333V29.3333H12V26.6667H20Z" fill="#EEEEEE"/>
                    <path d="M29.3333 22.6667V24H28V25.3333H3.99996V24H2.66663V22.6667H3.99996V21.3333H5.33329V18.6667H6.66663V10.6667H7.99996V8H9.33329V6.66667H10.6666V5.33333H13.3333V4H14.6666V1.33333H17.3333V4H18.6666V5.33333H21.3333V6.66667H22.6666V8H24V10.6667H25.3333V18.6667H26.6666V21.3333H28V22.6667H29.3333Z" fill="#EEEEEE"/>
                    </svg>

                    <span className='font-jersey text-accent-purple'>Following</span>
                </Button>
            </div>

            {/* filter inputs */}
            <div className="w-full flex flex-wrap md:justify-center gap-4">
                {/* keyword */}
                <div className="flex flex-col gap-2">
                    <Label>Search</Label>
                    <Input 
                        placeholder='Enter keyword'
                        value={keyword}
                        onChange={(e: React.FormEvent<HTMLInputElement>) => setKeyword(e.currentTarget.value)}
                    />
                </div>

                {/* start date */}
                <div className="flex flex-col gap-2">
                    <Label>Start date</Label>

                    <Popover 
                    open={isStartDateOpen} 
                    onOpenChange={setIsStartDateOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                className="w-48 justify-between font-normal"
                            >
                                {startDate ? startDate.toLocaleDateString() : "Select date"}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={startDate}
                                captionLayout="dropdown"
                                className='w-80 !bg-secondary'
                                onSelect={(date) => {
                                    setStartDate(date)
                                    setIsStartDateOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* end date */}
                <div className="flex flex-col gap-2">
                    <Label>End date</Label>

                    <Popover 
                    open={isEndDateOpen} 
                    onOpenChange={setIsEndDateOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                className="w-48 justify-between font-normal"
                            >
                                {endDate ? endDate.toLocaleDateString() : "Select date"}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={endDate}
                                captionLayout="dropdown"
                                className='w-80 !bg-secondary'
                                onSelect={(date) => {
                                    setEndDate(date)
                                    setIsEndDateOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                
                {/* status */}
                <div className="flex flex-col gap-2">
                    <Label>Status</Label>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className='w-full h-fit bg-secondary text-primary border font-normal outline-none'>{status ? (status == "1" ? "Active" : "Closed") : "Select"}</Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start" className='bg-secondary p-0'>
                            <DropdownMenuRadioGroup value={status} onValueChange={(value) => { setStatus(value); }}>
                                <DropdownMenuRadioItem value="" className='w-full h-full px-4 ps-8 py-2 flex items-center text-primary text-left hover:opacity-100 hover:bg-primary/5 cursor-pointer '>Select</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="1" className='w-full h-full px-4 ps-8 py-2 flex items-center text-primary text-left hover:opacity-100 hover:bg-primary/5 cursor-pointer '>Active</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="0" className='w-full h-full px-4 ps-8 py-2 flex items-center text-primary text-left hover:opacity-100 hover:bg-primary/5 cursor-pointer '>Closed</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                {/* users */}
                <div className="flex flex-col gap-2">
                    <Label>Author</Label>

                    <MultiSelect
                        values={selectedUsers}
                        onValuesChange={(values) => {
                            setSelectedUsers(values)
                        }}
                        resetSignal={resetSignal}
                    >
                        <MultiSelectTrigger className="w-full max-w-[300px]">
                            <MultiSelectValue placeholder="Select users" />
                        </MultiSelectTrigger>

                        <MultiSelectContent className="bg-secondary">
                            <MultiSelectGroup>
                                {users.map((user:any) => (
                                    <MultiSelectItem key={user.id} value={(String(user.id))} keywords={[user.name]} className='flex items-center gap-2 cursor-pointer'>
                                        { user.image ?
                                            <img src={'/storage/'+user.image} alt={user.name} className="w-4 h-4 rounded-full" />
                                        :
                                            <img src="/icons/user.svg" alt={user.name} className="w-4 h-4 rounded-full bg-accent-lime"/>
                                        }

                                        {user.name}
                                    </MultiSelectItem>
                                ))}
                            </MultiSelectGroup>
                        </MultiSelectContent>
                    </MultiSelect>
                </div>

                {/* reset button */}
                <div className="flex flex-col gap-2">
                    <Label>&nbsp;</Label>
                    <Button variant="default" onClick={resetFilters}>Reset</Button>
                </div>
            </div>

            {/* selected group */}
            <div className="w-full flex items-center md:justify-center gap-2">
                <Label>Selected group: </Label>
                <span className='font-bold'>{activeGroup ? groups.find((g:any) => g.id == activeGroup)?.name : 'None'}</span>
            </div>
        </div>

        {/* posts */}
        <div className="w-full py-8 flex flex-wrap gap-4">
            {posts.length > 0 ? posts.map((post:any) => (
                <Post 
                key={post.id} 
                post={post} 
                onSave={handlePostSaved} 
                onFollow={handlePostFollowing} 
                onDelete={handlePostDelete}
                onStatusChange={handlePostStatusChange}
                togglePreview={openPreview}
                openModalForEdit={openModalForEdit}
                />
            )) : (
                <p className='text-secondary text-base'>No posts found.</p>
            )}
        </div>

        {/* Post Preview Modal */}
        <PostPreviewModal 
        isOpen={isPreviewOpen} 
        togglePreview={openPreview} 
        post={postForPreview}
        />
    </div>
    );
}