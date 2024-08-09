'use client';
import { Button } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = axios.post('http://localhost:8000/api/logout/');
            sessionStorage.clear();
            router.push('/login');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header className="bg-black w-full h-20 fixed top-0 left-0 z-10">
            <div className="container mx-auto h-full px-4 flex justify-between items-center">
                <Link href="/dashboard" className="text-white text-2xl md:text-4xl font-bold">
                    Daily Management Meeting
                </Link>
                <nav className="flex items-center space-x-2 md:space-x-4">
                    <Button
                        variant='contained'
                        onClick={() => router.push('/targets')}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Set Targets
                    </Button>
                    <Button
                        variant='contained'
                        onClick={() => router.push('/archive')}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Archive
                    </Button>
                    <Button
                        variant='contained'
                        onClick={handleLogout}
                        className="bg-white hover:bg-gray-100 text-black"
                    >
                        Sign out
                    </Button>
                </nav>
            </div>
        </header>
    );
}