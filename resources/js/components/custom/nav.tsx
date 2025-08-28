import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";

const Nav = () => {
    const {props} : any = usePage();
    const user = props.user;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const handleBurgerClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
    <nav className="z-50 sticky top-0 left-0 flex justify-between items-center w-full h-[60px] px-4 font-jersey bg-primary *:text-secondary a:font-jersey border-b border-secondary/10 ease-in-out transition-all duration-300">
        <Link href="/" className="font-jersey">
            Organizimo
        </Link>

        <ul className={`w-10/12 min-h-[calc(100vh-60px)] md:min-h-auto bg-primary md:bg-transparent md:w-auto md:h-auto fixed md:static top-[60px] md:top-0 left-full md:left-0 flex flex-col md:flex-row items-center md:gap-8 *:text-secondary transition-all duration-300 shadow-2xl ${isMenuOpen ? "openMenu" : ""}`}>
            {!user ? (
            <>
                <li><Link href="/login" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">Login</Link></li>
                <li><Link href="/register" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">Register</Link></li>
            </>
            ) : (
            <>
                <li>
                    <Link href="/dashboard" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">
                        <img src="/icons/dashboard.svg" alt="Dashboard" className="w-8 h-8"/>
                    </Link>
                </li>

                <li>
                    <img src="/icons/notification.svg" alt="Notifications" className="w-8 h-8"/>
                </li>
                
                {/* Avatar menu - for desktop */}
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
                            <DropdownMenuItem className="p-0 border-b border-secondary/10">
                                <Link href="/profile" className="p-2 font-jersey text-secondary block w-full h-fit">Profile</Link>
                            </DropdownMenuItem>

                            {user.isAdmin && (
                                <DropdownMenuItem className="p-0 border-b border-secondary/10">
                                    <Link href="/admin" className="p-2 font-jersey text-secondary block w-full h-fit">Admin panel</Link>
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuItem className="p-0 border-b border-secondary/10">
                                <Link href="/logout" className="p-2 font-jersey text-secondary block w-full h-fit">Logout</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Mobile links */}
                <div className="w-full md:hidden">
                    <Link href="/profile" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">Profile</Link>
                    {user.isAdmin && (
                        <Link href="/admin" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">Admin panel</Link>
                    )}
                    <Link href="/logout" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">Logout</Link>
                </div>
            </>
            )}
        </ul>

        {/* burger */}
        <button onClick={handleBurgerClick} className={`md:hidden flex flex-col items-end cursor-pointer hover:opacity-50 ${isMenuOpen ? 'activeBurger' : ''}`}>
            <span className="block w-8 h-1 bg-secondary mb-1 transition-all ease-in-out duration-300"></span>
            <span className="block w-8 h-1 bg-secondary mb-1 transition-all ease-in-out duration-300"></span>
            <span className="block w-8 h-1 bg-secondary transition-all ease-in-out duration-300"></span>
        </button>
    </nav>
  )
}

export default Nav;