import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Images } from "../helpers/images";
import { AuthService } from "../service/api";
import Button from "./Button";

const NavBar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { profile } = Images;

    const onLogout = async () => {
        const data = await AuthService.logout();
        if (!data) return;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
    }

    return (
        <div className="sticky top-0 bg-white shadow-md z-50">
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
                <h1 className="cursor-pointer text-xl font-bold text-white bg-red-500 p-2" onClick={() => navigate("/movies")}>Booker.com</h1>
                <div className="md:hidden">
                    <button
                        className="text-gray-600 focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? "✖" : "☰"}
                    </button>
                </div>

                <div
                    className={`flex-col md:flex-row md:flex items-center gap-4 md:gap-6 md:static absolute bg-white md:bg-transparent w-full md:w-auto top-full left-0 md:left-auto border-t md:border-none transition-all duration-300 ${isMenuOpen ? "flex" : "hidden"
                        }`}
                >
                    <div className="flex flex-col md:flex-row gap-4 items-center p-4 md:p-0">
                        <div
                            className="p-2 rounded-full"
                        >
                            <img src={profile} alt="Profile" className="w-12 h-12 rounded-full" />
                        </div>
                        <Button text="Logout" isLoading={false} onClick={onLogout} type="button" style={"border border-red-500 text-red-500 hover:text-white hover:bg-red-500 rounded-lg px-4 py-2"} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar;