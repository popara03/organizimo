import { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";
import Notification, {NotificationProps} from "./notification";

const Nav = () => {
    const {props} : any = usePage();
    const user = props.user;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const handleBurgerClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // fetch last 10 notifications from backend
    const [notifications, setNotifications] = useState([
    { id: 1, post_id: 1, text: "Novi komentar od Marko Jovanovic na vašem postu Markaaaaaaaaaaaaa", time: "5 min ago", is_read: false },
    { id: 2, post_id: 2, text: "Diskusija \"Da li je velicina bitna?\" koju ste pratili je zatvorena.", time: "10 min ago", is_read: false },
    { id: 3, post_id: 3, text: "Novi odgovor od Ana Nikolic na vašem postu Post broj tri", time: "30 min ago", is_read: false },
    { id: 4, post_id: 4, text: "Novi komentar od Petar Petrovic na vašem postu Cetvrti post", time: "1 hour ago", is_read: true },
    { id: 5, post_id: 5, text: "Diskusija \"Kako nauciti React?\" koju ste pratili je zatvorena.", time: "2 hours ago", is_read: true },
    { id: 6, post_id: 6, text: "Novi odgovor od Jovana Jovanovic na vašem postu Post broj sest", time: "3 hours ago", is_read: true },
    { id: 7, post_id: 7, text: "Novi odgovor od Jovana Jovanovic na vašem postu Post broj sest", time: "3 hours ago", is_read: true },
    { id: 8, post_id: 8, text: "Novi odgovor od Jovana Jovanovic na vašem postu Post broj sest", time: "3 hours ago", is_read: true },
    { id: 9, post_id: 9, text: "Novi odgovor od Jovana Jovanovic na vašem postu Post broj sest", time: "3 hours ago", is_read: true },
    { id: 10, post_id: 10, text: "Novi odgovor od Jovana Jovanovic na vašem postu Post broj sest", time: "3 hours ago", is_read: true },
    ]);

    // check if all notifications are read on load
    const [isAllRead, setIsAllRead] = useState(false);

    const checkIsAllRead = () => {
        setIsAllRead(notifications.every((n) => n.is_read));
    };

    useEffect(() => {
        checkIsAllRead();
    }, [notifications])

    //child component handler for each notification status change
    const handleCheckIsAllRead = (id:number, value:boolean) => {
        let n  = notifications.find((n) => n.id === id);
        
        if(n){
            n.is_read = value;
            setNotifications([...notifications]);
        }
        else{
            console.error("Notification with passed ID not found", id);
        }
    };

    // child component handler for each notification removal
    const handleRemoveDeletedNotification = (id:number) => {
        setNotifications(notifications.filter((n) => n.id !== id));
    };

    // mark all notifications as read
    const markAllAsRead = () => {
        if(isAllRead) return;

        // TODO: Make API call to mark all notifications as read, special endpoint /notifications/mark-all-as-read
        
        notifications.forEach((n) => n.is_read = true);
        setNotifications([...notifications]);
        
        console.log("All notifications marked as read");
    }

    return (
    <nav className="z-50 sticky top-0 left-0 flex justify-between items-center w-full h-[60px] px-4 font-jersey bg-primary *:text-secondary a:font-jersey border-b border-secondary/10 ease-in-out transition-all duration-300">
        <Link href="/" className="font-jersey">
            Organizimo
        </Link>

        {/* notifications (mobile), burger icon */}
        <div className="w-fit flex items-center gap-8">
            {user && (
                /* notifications (mobile) */
                <Link href="/notifications" className="block md:hidden font-jersey w-full h-fit ">
                    {isAllRead ? (
                    <svg className="w-8 h-8 cursor-pointer hover:opacity-50 *:fill-secondary" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 26.6667V29.3333H18.6667V30.6667H13.3333V29.3333H12V26.6667H20Z" fill="#EEEEEE"/>
                    <path d="M29.3333 22.6667V24H28V25.3333H3.99996V24H2.66663V22.6667H3.99996V21.3333H5.33329V18.6667H6.66663V10.6667H7.99996V8H9.33329V6.66667H10.6666V5.33333H13.3333V4H14.6666V1.33333H17.3333V4H18.6666V5.33333H21.3333V6.66667H22.6666V8H24V10.6667H25.3333V18.6667H26.6666V21.3333H28V22.6667H29.3333Z" fill="#EEEEEE"/>
                    </svg>
                    ) : (
                    <svg className="w-8 h-8 cursor-pointer hover:opacity-50 *:fill-accent-purple" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 26.6667V29.3333H18.6667V30.6667H13.3333V29.3333H12V26.6667H20Z"/>
                    <path d="M29.3333 22.6667V24H28V25.3333H3.99996V24H2.66663V22.6667H3.99996V21.3333H5.33329V18.6667H6.66663V10.6667H7.99996V8H9.33329V6.66667H10.6666V5.33333H13.3333V4H14.6666V1.33333H17.3333V4H18.6666V5.33333H21.3333V6.66667H22.6666V8H24V10.6667H25.3333V18.6667H26.6666V21.3333H28V22.6667H29.3333Z" fill="#EEEEEE"/>
                    </svg>
                    )}
                </Link>
            )}

            {/* burger */}
            <button onClick={handleBurgerClick} className={`md:hidden flex flex-col items-end cursor-pointer hover:opacity-50 ${isMenuOpen ? 'activeBurger' : ''}`}>
                <span className="block w-8 h-1 bg-secondary mb-1 transition-all ease-in-out duration-300"></span>
                <span className="block w-8 h-1 bg-secondary mb-1 transition-all ease-in-out duration-300"></span>
                <span className="block w-8 h-1 bg-secondary transition-all ease-in-out duration-300"></span>
            </button>
        </div>

        <ul className={`w-10/12 min-h-[calc(100vh-60px)] md:min-h-auto bg-primary md:bg-transparent md:w-auto md:h-auto fixed md:static top-[60px] md:top-0 left-full md:left-0 flex flex-col md:flex-row items-center md:gap-8 *:text-secondary transition-all duration-300 shadow-2xl ${isMenuOpen ? "openMenu" : ""}`}>
            {!user ? (
            <>
                <li className="w-full"><Link href="/login" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10 hover:opacity-50">Login</Link></li>
                <li className="w-full"><Link href="/register" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10 hover:opacity-50">Register</Link></li>
            </>
            ) : (
            <>
                {/* dashboard */}
                <li className="w-full">
                    {/* desktop */}
                    <Link href="/dashboard" className="hidden md:block">
                        <img src="/icons/dashboard.svg" alt="Dashboard" className="w-8 h-8"/>
                    </Link>

                    {/* mobile */}
                    <Link href="/dashboard" className="block md:hidden font-jersey w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">
                        Dashboard
                    </Link>
                </li>

                {/* notifications */}
                <li className="hidden md:block w-full">
                    {/* desktop */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            {/* if has notifications, add class for fill change - notify */}
                            { isAllRead ? (
                                <svg className="w-8 h-8 cursor-pointer hover:opacity-50 *:fill-secondary" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 26.6667V29.3333H18.6667V30.6667H13.3333V29.3333H12V26.6667H20Z" fill="#EEEEEE"/>
                                <path d="M29.3333 22.6667V24H28V25.3333H3.99996V24H2.66663V22.6667H3.99996V21.3333H5.33329V18.6667H6.66663V10.6667H7.99996V8H9.33329V6.66667H10.6666V5.33333H13.3333V4H14.6666V1.33333H17.3333V4H18.6666V5.33333H21.3333V6.66667H22.6666V8H24V10.6667H25.3333V18.6667H26.6666V21.3333H28V22.6667H29.3333Z" fill="#EEEEEE"/>
                                </svg>
                            ) : (
                                <svg className="w-8 h-8 cursor-pointer hover:opacity-50 *:fill-accent-purple" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 26.6667V29.3333H18.6667V30.6667H13.3333V29.3333H12V26.6667H20Z"/>
                                <path d="M29.3333 22.6667V24H28V25.3333H3.99996V24H2.66663V22.6667H3.99996V21.3333H5.33329V18.6667H6.66663V10.6667H7.99996V8H9.33329V6.66667H10.6666V5.33333H13.3333V4H14.6666V1.33333H17.3333V4H18.6666V5.33333H21.3333V6.66667H22.6666V8H24V10.6667H25.3333V18.6667H26.6666V21.3333H28V22.6667H29.3333Z" fill="#EEEEEE"/>
                                </svg>
                            )}
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                        align="end"
                        className="w-96 max-h-96 h-96 p-0 pb-10 flex flex-col bg-primary rounded-none rounded-b-2xl overflow-y-auto scrollbar"
                        sideOffset={14}
                        >
                            {notifications.length === 0 && (
                                <p className="w-full h-full flex justify-center items-center px-4 py-2 text-secondary text-center">Crickets… no notifications here 🦗</p>
                            )}

                            {notifications.map((notification) => (
                                <DropdownMenuItem key={notification.id} className="p-0 flex flex-col gap-2 rounded-none border-b border-secondary/10 hover:bg-secondary/5">
                                    <Notification
                                    {...notification}
                                    handleCheckIsAllRead={handleCheckIsAllRead}
                                    handleRemoveDeletedNotification={handleRemoveDeletedNotification}
                                    />
                                </DropdownMenuItem>
                                ))}

                                <DropdownMenuLabel className="mt-auto absolute bottom-0 left-0 z-10 w-full h-10 p-0 flex justify-between items-center rounded-b-2xl overflow-hidden backdrop-blur-3xl">
                                    <Link href="/notifications" className="bg-accent-blue w-full h-full px-4 py-2 flex justify-center items-center text-center text-secondary rounded-none cursor-pointer hover:opacity-100 hover:bg-accent-blue/75 border-r border-secondary/10">
                                        See all
                                    </Link>

                                    <Button
                                    className="bg-accent-lime w-full h-full px-4 py-2 flex justify-center items-center text-center text-secondary rounded-none cursor-pointer hover:bg-accent-lime/75"
                                    onClick={markAllAsRead}>
                                        Mark all as read
                                    </Button>
                                </DropdownMenuLabel>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* on mobile it's outside of dropdown */}
                </li>

                {/* Avatar menu*/}
                <li className="w-full">
                    {/* desktop */}
                    <div className="hidden md:block">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex justify-center items-center w-8 h-8 rounded-full bg-secondary overflow-hidden border border-secondary cursor-pointer select-none hover:opacity-50">
                                    { user.image ?
                                        <img src={'/storage/'+user.image} alt={"avatar"} className="w-full h-full object-cover object-center select-none" />
                                    :
                                        <img src="/icons/user.svg" alt="avatar" className="relative -bottom-0.5 w-8 h-8"/>
                                    }
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                className="w-36 p-0 bg-primary rounded-none rounded-b-2xl overflow-hidden"
                                sideOffset={14}
                            >
                                <DropdownMenuItem className="p-0 border-b border-secondary/10 hover:bg-secondary/5">
                                    <Link href="/profile" className="p-2 font-jersey text-secondary block w-full h-fit hover:opacity-100 hover:bg-secondary/5">Profile</Link>
                                </DropdownMenuItem>

                                {user.isAdmin && (
                                    <DropdownMenuItem className="p-0 border-b border-secondary/10 hover:bg-secondary/5">
                                        <Link href="/admin" className="p-2 font-jersey text-secondary block w-full h-fit hover:opacity-100 hover:bg-secondary/5">Admin panel</Link>
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuItem className="p-0 border-b border-secondary/10 hover:bg-secondary/5">
                                    <Link href="/logout" className="p-2 font-jersey text-secondary block w-full h-fit hover:opacity-100 hover:bg-secondary/5">Logout</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    
                    {/* mobile */}
                    <div className="block md:hidden text-secondary">
                        <Link href="/profile" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">Profile</Link>
                        
                        {user.isAdmin && (
                            <Link href="/admin" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">Admin panel</Link>
                        )}

                        <Link href="/logout" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">Logout</Link>
                    </div>
                </li>
            </>
            )}
        </ul>
    </nav>
  )
}

export default Nav;