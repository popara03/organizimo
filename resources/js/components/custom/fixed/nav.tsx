import Notification from '@/components/custom/notification';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NotificationContext, NotificationProps } from '@/providers/notificationProvider';
import { Link, usePage } from '@inertiajs/react';
import { useContext, useState } from 'react';

const Nav = () => {
    const { props }: any = usePage();
    const user = props.active_user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleBurgerClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // get notification context
    const ctx = useContext(NotificationContext);
    const { notifications, isAllRead, markAllAsRead } = ctx;
    const [isProcessing, setIsProcessing] = useState(false);

    return (
        <nav className="font-jersey a:font-jersey sticky top-0 left-0 z-50 flex h-[60px] w-full items-center justify-between border-b border-secondary/10 bg-primary px-4 transition-all duration-300 ease-in-out *:text-secondary">
            <Link href="/" className="font-jersey">
                Organizimo
            </Link>

            {/* notifications (mobile), burger icon */}
            <div className="flex w-fit items-center gap-8">
                {user && (
                    /* notifications (mobile) */
                    <Link href="/notifications" className="font-jersey block h-fit w-full md:hidden">
                        {isAllRead ? (
                            <svg
                                className="h-8 w-8 cursor-pointer *:fill-secondary hover:opacity-50"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M20 26.6667V29.3333H18.6667V30.6667H13.3333V29.3333H12V26.6667H20Z" fill="#EEEEEE" />
                                <path
                                    d="M29.3333 22.6667V24H28V25.3333H3.99996V24H2.66663V22.6667H3.99996V21.3333H5.33329V18.6667H6.66663V10.6667H7.99996V8H9.33329V6.66667H10.6666V5.33333H13.3333V4H14.6666V1.33333H17.3333V4H18.6666V5.33333H21.3333V6.66667H22.6666V8H24V10.6667H25.3333V18.6667H26.6666V21.3333H28V22.6667H29.3333Z"
                                    fill="#EEEEEE"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-8 w-8 cursor-pointer *:fill-accent-purple hover:opacity-50"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M20 26.6667V29.3333H18.6667V30.6667H13.3333V29.3333H12V26.6667H20Z" />
                                <path
                                    d="M29.3333 22.6667V24H28V25.3333H3.99996V24H2.66663V22.6667H3.99996V21.3333H5.33329V18.6667H6.66663V10.6667H7.99996V8H9.33329V6.66667H10.6666V5.33333H13.3333V4H14.6666V1.33333H17.3333V4H18.6666V5.33333H21.3333V6.66667H22.6666V8H24V10.6667H25.3333V18.6667H26.6666V21.3333H28V22.6667H29.3333Z"
                                    fill="#EEEEEE"
                                />
                            </svg>
                        )}
                    </Link>
                )}

                {/* burger */}
                <button
                    onClick={handleBurgerClick}
                    className={`flex cursor-pointer flex-col items-end hover:opacity-50 md:hidden ${isMenuOpen ? 'activeBurger' : ''}`}
                >
                    <span className="mb-1 block h-1 w-8 bg-secondary transition-all duration-300 ease-in-out"></span>
                    <span className="mb-1 block h-1 w-8 bg-secondary transition-all duration-300 ease-in-out"></span>
                    <span className="block h-1 w-8 bg-secondary transition-all duration-300 ease-in-out"></span>
                </button>
            </div>

            <ul
                className={`fixed top-[60px] left-full flex min-h-[calc(100vh-60px)] w-10/12 flex-col items-center bg-primary shadow-2xl transition-all duration-300 *:text-secondary md:static md:top-0 md:left-0 md:h-auto md:min-h-auto md:w-auto md:flex-row md:gap-8 md:bg-transparent ${isMenuOpen ? 'openMenu' : ''}`}
            >
                {!user ? (
                    <>
                        <li className="w-full">
                            <Link
                                href="/login"
                                className="font-jersey block h-fit w-full border-b border-secondary/10 bg-primary p-4 hover:opacity-50 md:w-auto md:border-0 md:bg-transparent md:p-0"
                            >
                                Login
                            </Link>
                        </li>
                        <li className="w-full">
                            <Link
                                href="/register"
                                className="font-jersey block h-fit w-full border-b border-secondary/10 bg-primary p-4 hover:opacity-50 md:w-auto md:border-0 md:bg-transparent md:p-0"
                            >
                                Register
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        {/* dashboard */}
                        <li className="w-full">
                            {/* desktop */}
                            <Link href="/dashboard" className="hidden md:block">
                                <img src="/icons/dashboard.svg" alt="Dashboard" className="h-8 w-8" />
                            </Link>

                            {/* mobile */}
                            <Link
                                href="/dashboard"
                                className="font-jersey block h-fit w-full border-b border-secondary/10 bg-primary p-4 md:hidden md:w-auto md:border-0 md:bg-transparent md:p-0"
                            >
                                Dashboard
                            </Link>
                        </li>

                        {/* notifications */}
                        <li className="hidden w-full md:block">
                            {/* desktop */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    {/* if has notifications, add class for fill change - notify */}
                                    {isAllRead ? (
                                        <svg
                                            className="h-8 w-8 cursor-pointer *:fill-secondary hover:opacity-50"
                                            viewBox="0 0 32 32"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M20 26.6667V29.3333H18.6667V30.6667H13.3333V29.3333H12V26.6667H20Z" fill="#EEEEEE" />
                                            <path
                                                d="M29.3333 22.6667V24H28V25.3333H3.99996V24H2.66663V22.6667H3.99996V21.3333H5.33329V18.6667H6.66663V10.6667H7.99996V8H9.33329V6.66667H10.6666V5.33333H13.3333V4H14.6666V1.33333H17.3333V4H18.6666V5.33333H21.3333V6.66667H22.6666V8H24V10.6667H25.3333V18.6667H26.6666V21.3333H28V22.6667H29.3333Z"
                                                fill="#EEEEEE"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-8 w-8 cursor-pointer *:fill-accent-purple hover:opacity-50"
                                            viewBox="0 0 32 32"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M20 26.6667V29.3333H18.6667V30.6667H13.3333V29.3333H12V26.6667H20Z" />
                                            <path
                                                d="M29.3333 22.6667V24H28V25.3333H3.99996V24H2.66663V22.6667H3.99996V21.3333H5.33329V18.6667H6.66663V10.6667H7.99996V8H9.33329V6.66667H10.6666V5.33333H13.3333V4H14.6666V1.33333H17.3333V4H18.6666V5.33333H21.3333V6.66667H22.6666V8H24V10.6667H25.3333V18.6667H26.6666V21.3333H28V22.6667H29.3333Z"
                                                fill="#EEEEEE"
                                            />
                                        </svg>
                                    )}
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    align="end"
                                    className="scrollbar flex h-96 max-h-96 w-96 flex-col overflow-y-auto rounded-none rounded-b-2xl bg-primary p-0 pb-10"
                                    sideOffset={14}
                                >
                                    {notifications?.length === 0 && (
                                        <p className="flex h-full w-full items-center justify-center px-4 py-2 text-center text-secondary">
                                            Crickets… no notifications here 🦗
                                        </p>
                                    )}

                                    {notifications?.map((notification: NotificationProps) => (
                                        <DropdownMenuItem
                                            key={notification.id}
                                            className="flex flex-col gap-2 rounded-none border-b border-secondary/10 p-0 hover:bg-secondary/5"
                                        >
                                            <Notification {...notification} />
                                        </DropdownMenuItem>
                                    ))}

                                    <DropdownMenuLabel className="absolute bottom-0 left-0 z-10 mt-auto flex h-10 w-full items-center justify-between overflow-hidden rounded-b-2xl p-0 backdrop-blur-3xl">
                                        <Link
                                            href="/notifications"
                                            className="flex h-full w-full cursor-pointer items-center justify-center rounded-none border-r border-secondary/10 bg-accent-blue px-4 py-2 text-center text-secondary hover:bg-accent-blue/75 hover:opacity-100"
                                        >
                                            See all
                                        </Link>

                                        <Button
                                            className="flex h-full w-full cursor-pointer items-center justify-center rounded-none bg-accent-lime px-4 py-2 text-center text-secondary hover:bg-accent-lime/75"
                                            onClick={() => {
                                                setIsProcessing(true);
                                                markAllAsRead().finally(() => {
                                                    setIsProcessing(false);
                                                });
                                            }}
                                            disabled={isAllRead || isProcessing}
                                        >
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
                                        <div className="flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-secondary bg-secondary select-none hover:opacity-50">
                                            {user.image ? (
                                                <img
                                                    src={'/storage/' + user.image}
                                                    alt={'avatar'}
                                                    className="h-full w-full scale-125 object-cover object-center select-none"
                                                />
                                            ) : (
                                                <img src="/icons/user.svg" alt="avatar" className="relative -bottom-0.5 h-8 w-8" />
                                            )}
                                        </div>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="w-36 overflow-hidden rounded-none rounded-b-2xl bg-primary p-0" sideOffset={14}>
                                        <DropdownMenuItem asChild className="border-b border-secondary/10 p-0 hover:bg-secondary/5">
                                            <Link
                                                href="/profile"
                                                className="font-jersey block h-fit w-full cursor-pointer p-2 text-secondary hover:bg-secondary/5 hover:opacity-100"
                                            >
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>

                                        {user.role_id === 2 && (
                                            <DropdownMenuItem asChild className="border-b border-secondary/10 p-0 hover:bg-secondary/5">
                                                <Link
                                                    href="/admin"
                                                    className="font-jersey block h-fit w-full cursor-pointer p-2 text-secondary hover:bg-secondary/5 hover:opacity-100"
                                                >
                                                    Admin panel
                                                </Link>
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuItem asChild className="border-b border-secondary/10 p-0 hover:bg-secondary/5">
                                            <Link
                                                href="/logout"
                                                className="font-jersey block h-fit w-full cursor-pointer p-2 text-secondary hover:bg-secondary/5 hover:opacity-100"
                                            >
                                                Logout
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* mobile */}
                            <div className="block text-secondary md:hidden">
                                <Link
                                    href="/profile"
                                    className="font-jersey block h-fit w-full border-b border-secondary/10 bg-primary p-4 md:w-auto md:border-0 md:bg-transparent md:p-0"
                                >
                                    Profile
                                </Link>

                                {user.role_id === 2 && (
                                    <Link
                                        href="/admin"
                                        className="font-jersey block h-fit w-full border-b border-secondary/10 bg-primary p-4 md:w-auto md:border-0 md:bg-transparent md:p-0"
                                    >
                                        Admin panel
                                    </Link>
                                )}

                                <Link
                                    href="/logout"
                                    className="font-jersey block h-fit w-full border-b border-secondary/10 bg-primary p-4 md:w-auto md:border-0 md:bg-transparent md:p-0"
                                >
                                    Logout
                                </Link>
                            </div>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Nav;
