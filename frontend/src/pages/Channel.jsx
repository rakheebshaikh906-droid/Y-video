
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Video, Eye, ThumbsUp, Users, Upload } from "lucide-react";

import Loader from "../components/Loader";
import VideoGrid from "../components/VideoGrid";
import { apiRequest } from "../services/api";

function Channel() {
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function fetchChannel() {
            try {
                setLoading(true);
                setError("");

                const userResponse = await apiRequest("/users/current-user");
                const user =
                    userResponse?.data?.user ??
                    userResponse?.data;

                const channelId = user?._id;

                if (!channelId) {
                    throw new Error("Unable to identify your channel. Please log in again.");
                }

                const [statsResponse, videosResponse] = await Promise.all([
                    apiRequest(`/dashboard/channel/${channelId}`),
                    apiRequest(`/dashboard/channel/${channelId}/videos`),
                ]);

                const stats =
                    statsResponse?.data?.channel ??
                    statsResponse?.data;

                const videoList =
                    videosResponse?.data?.videos ??
                    videosResponse?.data?.docs ??
                    videosResponse?.data;

                if (!cancelled) {
                    setChannel({
                        ...user,
                        ...(stats && typeof stats === "object" ? stats : {}),
                    });

                    setVideos(Array.isArray(videoList) ? videoList : []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Unable to load channel details.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchChannel();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return <Loader message="Loading your channel..." />;
    }

    if (error) {
        return (
            <main className="min-h-screen bg-white px-5 py-12 dark:bg-black">
                <p role="alert" className="text-red-600">{error}</p>
                <Link to="/login" className="mt-4 inline-block text-red-600 hover:underline">
                    Go to login
                </Link>
            </main>
        );
    }

    const fullName = channel?.fullName || channel?.username || "My Channel";
    const avatarUrl = channel?.avatar;
    const coverUrl = channel?.coverImage;

    const stats = [
        { label: "Videos", value: channel?.totalVideos ?? videos.length, icon: Video },
        { label: "Views", value: channel?.totalViews ?? 0, icon: Eye },
        { label: "Likes", value: channel?.totalLikes ?? 0, icon: ThumbsUp },
        { label: "Subscribers", value: channel?.totalSubscribers ?? 0, icon: Users },
    ];

    return (
        <main className="min-h-screen bg-white px-4 py-6 dark:bg-black sm:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="relative h-36 overflow-hidden rounded-2xl bg-gradient-to-r from-red-700 to-zinc-900 sm:h-56">
                    {coverUrl && (
                        <img
                            src={coverUrl}
                            alt="Channel cover"
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>

                <section className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={fullName}
                                className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-3xl font-bold text-white sm:h-24 sm:w-24">
                                {fullName.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {fullName}
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                @{channel?.username || "user"}
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/upload"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                    >
                        <Upload size={18} />
                        Upload video
                    </Link>
                </section>

                <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {stats.map(({ label, value, icon: Icon }) => (
                        <div
                            key={label}
                            className="rounded-xl border border-gray-200 p-4 dark:border-zinc-800"
                        >
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Icon size={18} />
                                <span className="text-sm">{label}</span>
                            </div>
                            <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                                {Number(value).toLocaleString("en-IN")}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="border-t border-gray-200 pt-6 dark:border-zinc-800">
                    <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                        Your videos
                    </h2>

                    <VideoGrid videos={videos} />
                </section>
            </div>
        </main>
    );
}

export default Channel;
