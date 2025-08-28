import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const handleBurgerClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const {props} : any = usePage();
    const user = props.user;

    return (
    <nav className="z-50 sticky top-0 left-0 flex justify-between items-center w-full h-[60px] px-4 font-jersey bg-primary *:text-secondary a:font-jersey border-b border-secondary/10 ease-in-out transition-all duration-300">
        <Link href="/" className="font-jersey">
            Organizimo
        </Link>

        <ul className={`w-10/12 min-h-[calc(100vh-60px)] md:min-h-auto bg-primary md:bg-transparent md:w-auto md:h-auto fixed md:static top-[60px] md:top-0 left-full md:left-0 flex flex-col md:flex-row md:gap-8 *:text-secondary transition-all duration-300 shadow-2xl ${isMenuOpen ? "openMenu" : ""}`}>
            {!user ? (
            <>
                <li><Link href="/login" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">Login</Link></li>
                <li><Link href="/register" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">Register</Link></li>
            </>
            ) : (
            <>
                <li><Link href="/dashboard" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">Dashboard</Link></li>
                <li><Link href="/profile" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">Profile</Link></li>
                <li><Link href="/logout" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">Logout</Link></li>
                {user.isAdmin && (
                    <li><Link href="/admin" className="font-jersey block w-full h-fit md:w-auto p-4 md:p-0 bg-primary md:bg-transparent border-b md:border-0 border-secondary/10">Admin</Link></li>
                )}
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