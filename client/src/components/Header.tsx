import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return (
        <header className="flex items-center justify-between px-6 py-3">
            <Link to='/' className="text-2xl font-semibold text-textL tracking-tight cursor-pointer">
                Coditor
            </Link>
            <nav className="flex items-center justify-center gap-3 sm:gap-4">
                <Link to="/price" className="text-secondaryL font-semibold cursor-pointer hover:text-primaryL transition-colors duration-200">
                    Price
                </Link>
                <Button
                    variant="outline"
                    className="rounded text-base px-4 py-2 "
                    onClick={() => navigate("/signin")}
                >
                    LOGIN
                </Button>
                <Button
                    variant="default"
                    onClick={() => navigate("/signup")}
                    className="rounded text-base px-4 py-2"
                >
                    GET STARTED
                </Button>
            </nav>
        </header>
    );
}
