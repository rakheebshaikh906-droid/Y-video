
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Menu,
    Search,
    Mic,
    Plus,
    Bell,
    Play,
} from "lucide-react";

function Navbar({ onMenuClick, onSearch }) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch?.(searchQuery.trim());
    };

    return (
        <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-[#0f0f0f] px-4 text-white md:px-6">
            {/* Left: Menu and Logo */}
            <div className="flex shrink-0 items-center gap-3">
                <button
                    onClick={onMenuClick}
                    aria-label="Toggle sidebar"
                    className="rounded-full p-2 hover:bg-white/10"
                >
                    <Menu size={24} />
                </button>

                <Link to="/" className="flex items-center gap-2">
                    <span className="flex h-8 w-10 items-center justify-center rounded-lg bg-red-600">
                        <Play size={21} fill="white" />
                    </span>

                    <span className="text-xl font-extrabold tracking-tight">
                        <span className="text-red-500">Y</span>Video
                    </span>
                </Link>
            </div>

            {/* Center: Search */}
            <form
                onSubmit={handleSearch}
                className="mx-auto hidden w-full max-w-2xl items-center sm:flex"
            >
                <div className="flex h-10 min-w-0 flex-1 items-center rounded-l-full border border-white/20 bg-[#121212] pl-4 focus-within:border-blue-500">
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search videos, channels, or topics..."
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-400"
                    />
                </div>

                <button
                    type="submit"
                    aria-label="Search videos"
                    className="flex h-10 w-16 items-center justify-center rounded-r-full border border-l-0 border-white/20 bg-white/10 hover:bg-white/20"
                >
                    <Search size={21} />
                </button>

                <button
                    type="button"
                    aria-label="Voice search"
                    className="ml-3 rounded-full bg-white/10 p-2.5 hover:bg-white/20"
                >
                    <Mic size={20} />
                </button>
            </form>

            {/* Right: Actions */}
            <div className="flex shrink-0 items-center gap-2 md:gap-4">
                <Link
                    to="/upload"
                    className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
                >
                    <Plus size={20} />
                    <span className="hidden md:inline">Create</span>
                </Link>

                <button
                    aria-label="Notifications"
                    className="rounded-full p-2 hover:bg-white/10"
                >
                    <Bell size={22} />
                </button>

                <Link
                    to="/channel"
                    aria-label="My channel"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-purple-600 text-sm font-bold ring-2 ring-white/10"
                >
                    Y
                </Link>
            </div>
        </header>
    );
}

export default Navbar;
