import { useState } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="w-full bg-bgL shadow-sm fixed top-0 left-0 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
                <Link
                    to="/"
                    className="text-2xl font-bold text-textL tracking-tight cursor-pointer"
                >
                    Coditor
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-4">
                    <Link
                        to="/price"
                        className="text-secondaryL font-semibold hover:text-primaryL transition-colors"
                    >
                        Price
                    </Link>
                    <Button
                        variant="outline"
                        className="rounded text-base px-4 py-2"
                        onClick={() => navigate("/authenticate/signin")}
                    >
                        LOGIN
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => navigate("/authenticate/signup")}
                        className="rounded text-base px-4 py-2"
                    >
                        GET STARTED
                    </Button>
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-textL"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-bgL px-4 py-4 border-t border-secondaryL/30 space-y-4">
                    <Link
                        to="/price"
                        className="block text-secondaryL font-medium hover:text-primaryL"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Price
                    </Link>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            navigate("/authenticate/signin");
                            setMobileMenuOpen(false);
                        }}
                    >
                        LOGIN
                    </Button>
                    <Button
                        variant="default"
                        className="w-full"
                        onClick={() => {
                            navigate("/authenticate/signup");
                            setMobileMenuOpen(false);
                        }}
                    >
                        GET STARTED
                    </Button>
                </div>
            )}
        </header>
    );
}
