
import { NavLink } from "react-router-dom";
import {
    Home,
    Zap,
    PlaySquare,
    History,
    Clock,
    ThumbsUp,
    Film,
    Radio,
    Gamepad2,
    Newspaper,
    Trophy,
    Lightbulb,
    Shirt,
    Podcast,
    ChevronRight,
    User,
} from "lucide-react";

const mainLinks = [
    { label: "Home", icon: Home, to: "/" },
    { label: "Shorts", icon: Zap, to: "/shorts" },
    { label: "Subscriptions", icon: PlaySquare, to: "/subscriptions" },
];

const personalLinks = [
    { label: "Your Channel", icon: User, to: "/channel" },
    { label: "History", icon: History, to: "/history" },
    { label: "Your Videos", icon: PlaySquare, to: "/your-videos" },
    { label: "Watch Later", icon: Clock, to: "/watch-later" },
    { label: "Liked Videos", icon: ThumbsUp, to: "/liked-videos" },
];

const exploreLinks = [
    { label: "Trending", icon: Zap },
    { label: "Music", icon: Radio },
    { label: "Movies", icon: Film },
    { label: "Gaming", icon: Gamepad2 },
    { label: "News", icon: Newspaper },
    { label: "Sports", icon: Trophy },
    { label: "Learning", icon: Lightbulb },
    { label: "Fashion", icon: Shirt },
    { label: "Podcasts", icon: Podcast },
];

function Sidebar({ open = true, onNavigate }) {
    if (!open) return null;

    const linkClass = ({ isActive }) =>
        `flex w-full items-center gap-5 rounded-xl px-3 py-2.5 text-sm transition ${isActive
            ? "bg-white/10 font-semibold text-white"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }`;

    return (
        <aside className="fixed bottom-0 left-0 top-16 z-40 w-60 overflow-y-auto border-r border-white/10 bg-[#0f0f0f] px-3 py-4 text-white">
            <nav className="space-y-1">
                {mainLinks.map(({ label, icon: Icon, to }) => (
                    <NavLink
                        key={label}
                        to={to}
                        end={to === "/"}
                        className={linkClass}
                        onClick={onNavigate}
                    >
                        <Icon size={21} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="my-4 border-t border-white/10" />

            <section>
                <h2 className="mb-2 flex items-center gap-2 px-3 text-sm font-semibold">
                    You <ChevronRight size={16} />
                </h2>

                {personalLinks.map(({ label, icon: Icon, to }) => (
                    <NavLink
                        key={label}
                        to={to}
                        className={linkClass}
                        onClick={onNavigate}
                    >
                        <Icon size={21} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </section>

            <div className="my-4 border-t border-white/10" />

            <section>
                <h2 className="mb-2 px-3 text-sm font-semibold">Explore</h2>

                {exploreLinks.map(({ label, icon: Icon }) => (
                    <button
                        key={label}
                        type="button"
                        className="flex w-full items-center gap-5 rounded-xl px-3 py-2.5 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                    >
                        <Icon size={21} />
                        <span>{label}</span>
                    </button>
                ))}
            </section>

            <div className="my-4 border-t border-white/10" />

            <p className="px-3 text-xs leading-5 text-gray-500">
                Your videos. Your community. Your YVideo.
            </p>
        </aside>
    );
}

export default Sidebar;
