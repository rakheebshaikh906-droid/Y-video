
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Menu,
    Search,
    Plus,
    Bell,
    Play,
    LogIn,
    LogOut,
} from "lucide-react";
//buggs
function Navbar({
    onMenuClick,
    onSearch,
    isLoggedIn = false,
    onLogout,
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [loggingOut, setLoggingOut] = useState(false);

    function handleSearch(event) {
        event.preventDefault();
        onSearch?.(searchQuery.trim());
    }

    async function handleLogout() {
        if (!onLogout) return;

        setLoggingOut(true);

        try {
            await onLogout();
        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between gap-2 border-b border-white/10 bg-[#0f0f0f] px-3 text-white sm:gap-4 sm:px-4 md:px-6">
            {/* Menu and Logo */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Toggle sidebar"
                    className="rounded-full p-2 hover:bg-white/10"
                >
                    <Menu size={24} />
                </button>

                <Link to="/" className="flex items-center gap-2">
                    <span className="flex h-8 w-9 items-center justify-center rounded-lg bg-red-600">
                        <Play size={21} fill="white" />
                    </span>

                    <span className="hidden text-xl font-extrabold tracking-tight sm:inline">
                        <span className="text-red-500">Y</span>Video
                    </span>
                </Link>
            </div>

            {/* Search */}
            <form
                onSubmit={handleSearch}
                role="search"
                className="flex min-w-0 max-w-2xl flex-1 items-center"
            >
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search videos"
                    aria-label="Search videos"
                    className="min-w-0 flex-1 rounded-l-full border border-r-0 border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 focus:border-blue-500 sm:px-5"
                />

                <button
                    type="submit"
                    aria-label="Search"
                    className="rounded-r-full border border-zinc-700 bg-zinc-800 px-3 py-2 hover:bg-zinc-700 sm:px-5"
                >
                    <Search size={20} />
                </button>
            </form>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                {isLoggedIn && (
                    <Link
                        to="/upload"
                        className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-2 text-sm font-semibold hover:bg-white/20 sm:px-3"
                    >
                        <Plus size={20} />
                        <span className="hidden md:inline">Create</span>
                    </Link>
                )}

                {isLoggedIn && (
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="hidden rounded-full p-2 hover:bg-white/10 sm:inline-flex"
                    >
                        <Bell size={22} />
                    </button>
                )}

                {isLoggedIn ? (
                    <>
                        <Link
                            to="/channel"
                            aria-label="My channel"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-purple-600 text-sm font-bold"
                        >
                            Y
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20 disabled:opacity-50"
                        >
                            <LogOut size={17} />
                            <span className="hidden sm:inline">
                                {loggingOut ? "Logging out..." : "Logout"}
                            </span>
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1 rounded-full border border-zinc-600 px-3 py-2 text-sm font-semibold hover:bg-white/10"
                    >
                        <LogIn size={17} />
                        <span>Sign in</span>
                    </Link>
                )}
            </div>
        </header>
    );
}

export default Navbar;
