import { Form, router, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
    const { user } = usePage().props as any;

    const [newImage, setNewImage] = useState<File | null>(null);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onloadend = () => {
                setNewImage(file);
            };

            reader.readAsDataURL(file);
        }
    };

    return (
    <div className="px-4">
        {/* User details */}
        <Form
        action="/update-profile"
        method="post"
        disableWhileProcessing
        onSuccess={
            () => {
                toast.success('Profile details updated successfully.');
            }
        }
        className="w-full h-full flex flex-col md:flex-row gap-4 justify-between pb-4 border-b border-primary/10"
        >
            {({processing, errors}) => (
            <>
                {/* image wrapper */}
                <div className="relative w-76 h-76 shrink-0">
                    {/* image */}
                    <div className="w-full h-full rounded-full flex justify-center items-center overflow-hidden bg-accent-lime">
                        {newImage ?
                            <img src={URL.createObjectURL(newImage)} alt="avatar" className="w-full h-full object-cover object-center select-none" />
                        :
                        <>
                        { user.image ?
                            <img src={'/storage/'+user.image} alt={"avatar"} className="w-full h-full object-cover object-center select-none" />
                        :
                            <img src="/icons/user.svg" alt="avatar" className="w-full h-full object-cover object-center select-none relative -bottom-5"/>
                        }
                        </>
                        }
                    </div>

                    {/* edit icon */}
                    <div className="absolute bottom-5 right-10 rounded-full cursor-pointer">
                        <Button size="icon" className="relative !p-1 flex justify-center items-center bg-accent-purple overflow-hidden" tabIndex={-1}>
                            <>
                                <svg className="!min-w-6 !min-h-6" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g className="*:fill-secondary"  filter="url(#filter0_d_185_586)">
                                    <path d="M20 9.99976H21V11.9998H20V12.9998H19V13.9998H18V14.9998H17V15.9998H16V16.9998H15V17.9998H14V18.9998H13V19.9998H12V20.9998H11V21.9998H10V22.9998H4V16.9998H5V15.9998H6V14.9998H7V13.9998H8V12.9998H9V11.9998H10V10.9998H11V9.99976H12V8.99976H13V7.99976H14V6.99976H15V5.99976H17V6.99976H18V7.99976H19V8.99976H20V9.99976Z" fill="black" />
                                    <path d="M26 4.99976V6.99976H25V7.99976H24V8.99976H23V9.99976H22V8.99976H21V7.99976H20V6.99976H19V5.99976H18V4.99976H17V3.99976H18V2.99976H19V1.99976H20V0.999756H22V1.99976H23V2.99976H24V3.99976H25V4.99976H26Z" fill="black" />
                                </g>
                                <defs>
                                    <filter id="filter0_d_185_586" x="-1" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="4" />
                                    <feGaussianBlur stdDeviation="2" />
                                    <feComposite in2="hardAlpha" operator="out" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_185_586" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_185_586" result="shape" />
                                    </filter>
                                </defs>
                                </svg>

                                <Input
                                type="file"
                                name="image"
                                className="absolute w-96 h-96 cursor-pointer"
                                onChange={handleFileChange}
                                />
                            </>
                        </Button>
                    </div>

                    <InputError message={errors.image} />
                </div>
                
                {/* name and position */}
                <div className="flex flex-col">
                    {/* name */}
                    <div className="flex flex-col gap-2">
                    <Input
                    type="text"
                    name="name"
                    defaultValue={user.name}
                    className="w-full h-full !text-5xl md:!text-8xl font-jersey p-0 focus:px-2 border-0 shadow-none"
                    />
                    <InputError message={errors.name} />
                    </div>

                    {/* position */}
                    <div className="flex flex-col gap-2">
                        <Input
                        type="text"
                        name="position"
                        defaultValue={user.position || ''}
                        placeholder="Current position"
                        className="w-full md:max-w-96 !text-xl p-0 focus:px-2 border-0 shadow-none"
                        />
                        <InputError message={errors.position} />
                    </div>
                </div>
                    
                {/* btn */}
                <div className="w-full md:w-fit flex flex-col justify-end md:items-end gap-4">
                    <Button
                    type="submit"
                    className="w-full text-secondary bg-primary cursor-pointer"
                    >
                        {processing ? <LoaderCircle className="h-7 w-7 stroke-secondary animate-spin" /> : 'Save changes'}
                    </Button>

                    <p className="md:text-end">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
            </>
            )}
        </Form>

        {/* Password change */}
        <div className="py-4 flex flex-col gap-4">
            <h2 className="font-jersey !text-5xl">Change password</h2>
            
            <Form
            action="/change-password"
            method="post"
            disableWhileProcessing
            resetOnSuccess
            onSuccess={
                () => toast.success('Password changed successfully')
            }
            className="w-full md:w-76 flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="current_password" required>Current password</Label>
                        <Input
                            id="current_password"
                            type="password"
                            name="current_password"
                            required
                            autoComplete="current-password"
                            placeholder="Current Password"
                        />
                        <InputError message={errors.current_password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="new_password" required>New password</Label>
                        <Input
                            id="new_password"
                            type="password"
                            name="new_password"
                            required
                            autoComplete="new-password"
                            placeholder="New Password"
                        />
                        <InputError message={errors.new_password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="confirm_password" required>Confirm password</Label>
                        <Input
                            id="confirm_password"
                            type="password"
                            name="confirm_password"
                            required
                            autoComplete="new-password"
                            placeholder="Confirm Password"
                        />
                        <InputError message={errors.confirm_password} />
                    </div>

                    <Button
                    type="submit"
                    className="text-secondary bg-primary  cursor-pointer"
                    >
                        {processing ? <LoaderCircle className="h-7 w-7 stroke-secondary animate-spin" /> : 'Change Password'}
                    </Button>
                </>
                )}
            </Form>
        </div>
    </div>
    )
}

export default Profile