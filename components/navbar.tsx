import { useRouter } from "next/router";
import { Button } from "./ui/button";
import Link from "next/link";
import useUserStore from "@/stores/userStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import userService from "@/services/userService";

function Navbar() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { isLoggedIn, setIsLoggedIn } = useUserStore();
    
    const { data: userData } = useQuery({
        queryKey: ["user", "me"],
        queryFn: userService.fetchUser,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    function renderNavItems() {
        if (!isLoggedIn || !userData) return null;

        switch (userData.user_type) {
            case "Staff":
                return (
                    <div className="flex gap-4">
                        <Link href="/flights/airport/list">Airports</Link>
                        <Link href="/flights/airline/list">Airlines</Link>
                        <Link href="/flights/flight/list">Flights</Link>
                    </div>
                );
            case "Host":
                return (
                    <div className="flex gap-4">
                        <Link href="/rent/property/list">Property</Link>
                    </div>
                );
            default:
                return null;
        }
    }

    function renderButton() {
        if (isLoggedIn) {
            return (
                <Button onClick={() => logOut()}>Log out</Button>
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
        <nav className="bg-white shadow px-4">
            <div className="flex items-center justify-between py-2 w-[96%] mx-auto">
                <Link href="/">
                    <h2>Travel Anywhere</h2>
                </Link>
                
                {/* Navigation Items */}
                {renderNavItems()}
                
                {/* Auth Button */}
                {renderButton()}
            </div>
        </nav>
    );
}

export default Navbar;