import { useRouter } from "next/router";
import { Button } from "./ui/button";
import Link from "next/link";
import useUserStore from "@/stores/userStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import userService from "@/services/userService";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { isLoggedIn, setIsLoggedIn } = useUserStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const { data: userData } = useQuery({
        queryKey: ["user", "me"],
        queryFn: userService.fetchUser,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    function renderNavItems() {
        if (!isLoggedIn || !userData) return null;

        type NavItem = { href: string; label: string; }[];
        type NavItems = {
            Staff: NavItem;
            Host: NavItem;
        };

        const navItems: NavItems = {
            "Staff": [
                { href: "/flights/airport/list", label: "Airports" },
                { href: "/flights/airline/list", label: "Airlines" },
                { href: "/flights/flight/list", label: "Flights" },
            ],
            "Host": [
                { href: "/rent/property/list", label: "Property" },
            ],
        };

        const userNavItems = navItems[userData.user_type as keyof NavItems];
        if (!userNavItems) return null;

        return (
            <div className="hidden md:flex gap-6">
                {userNavItems.map((item: any) => (
                    <Link 
                        key={item.href} 
                        href={item.href}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        );
    }

    function renderMobileMenu() {
        if (!isLoggedIn || !userData) return null;

        return (
            <div className={`
                md:hidden 
                fixed inset-0 bg-white z-50 
                transform transition-transform duration-300 ease-in-out
                ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="p-4">
                    <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute top-4 right-4"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    
                    <div className="flex flex-col gap-4 mt-12">
                        {isLoggedIn && (
                            <>
                                <Link href="/payments" className="text-gray-600 hover:text-gray-900 px-1">
                                    Booking History
                                </Link>
                                <Link 
                                    href="/home/flights/ticket" 
                                    className="text-gray-600 hover:text-gray-900 transition-colors px-1"
                                >
                                    Flight Tickets
                                </Link>
                                <Link href="/home/flights/list" className="text-gray-600 hover:text-gray-900 px-1">
                                    Book a flight
                                </Link>
                            </>
                        )}
                        {userData.user_type === "Staff" && (
                            <>
                                <Link href="/flights/airport/list" className="text-gray-600 hover:text-gray-900 px-1">
                                    Airports
                                </Link>
                                <Link href="/flights/airline/list" className="text-gray-600 hover:text-gray-900 px-1">
                                    Airlines
                                </Link>
                                <Link href="/flights/flight/list" className="text-gray-600 hover:text-gray-900 px-1">
                                    Flights
                                </Link>
                            </>
                        )}
                        {userData.user_type === "Host" && (
                            <Link href="/rent/property/list" className="text-gray-600 hover:text-gray-900 px-1">
                                Property
                            </Link>
                        )}
                        {renderButton()}
                    </div>
                </div>
            </div>
        );
    }

    function renderButton() {
        if (isLoggedIn) {
            return (
                <Button className="w-fit" onClick={() => logOut()}>Log out</Button>
            );
        }

        return (
            <Button>
                <Link href="/login">Log In</Link>
            </Button>
        );
    }

    function logOut() {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        queryClient.invalidateQueries();
        router.push("/login");
    }

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <h2 className="text-xl font-bold text-gray-900">Travel Anywhere</h2>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {isLoggedIn && (
                            <>
                                <Link 
                                    href="/payments" 
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Booking History
                                </Link>
                                <Link 
                                    href="/home/flights/ticket" 
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Flight Tickets
                                </Link>
                                <Link 
                                    href="/home/flights/list" 
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Book a flight
                                </Link>
                            </>
                        )}
                        {renderNavItems()}
                        {renderButton()}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {renderMobileMenu()}
        </nav>
    );
}

export default Navbar;