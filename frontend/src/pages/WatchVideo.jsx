
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ThumbsUp, Share2, MoreHorizontal } from "lucide-react";

import Loader from "../components/Loader";
import VideoGrid from "../components/VideoGrid";
import { getAllVideos, getVideoById } from "../services/videoService";

function WatchVideo() {
    const { videoId } = useParams();

    const [video, setVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function fetchVideo() {
            setLoading(true);
            setError("");

            try {
                const [videoResponse, videosResponse] = await Promise.all([
                    getVideoById(videoId),
                    getAllVideos({ limit: 8 }),
                ]);

                const currentVideo =
                    videoResponse?.data?.video ??
                    videoResponse?.data;

                const allVideos =
                    videosResponse?.data?.videos ??
                    videosResponse?.data?.docs ??
                    videosResponse?.data ??
                    [];

                if (!currentVideo || !currentVideo._id) {
                    throw new Error("Video details could not be loaded.");
                }

                if (!cancelled) {
                    setVideo(currentVideo);
                    setRelatedVideos(
                        Array.isArray(allVideos)
                            ? allVideos.filter((item) => item._id !== currentVideo._id)
                            : []
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Unable to load this video.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchVideo();

        return () => {
            cancelled = true;
        };
    }, [videoId]);

    if (loading) {
        return <Loader message="Loading video..." />;
    }

    if (error) {
        return (
            <main className="min-h-screen bg-white px-5 py-12 dark:bg-black">
                <p role="alert" className="text-red-600">{error}</p>
                <Link to="/" className="mt-4 inline-block text-sm text-red-600">
                    Back to home
                </Link>
            </main>
        );
    }

    const channelName =
        video.owner?.fullName ||
        video.owner?.username ||
        video.owner?.name ||
        "Unknown channel";

    const videoUrl =
        typeof video.videoFile === "string"
            ? video.videoFile
            : video.videoFile?.url;

    return (
        <main className="min-h-screen bg-white px-4 py-6 dark:bg-black sm:px-6">
            <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
                <section className="min-w-0">
                    <div className="overflow-hidden rounded-xl bg-black">
                        {videoUrl ? (
                            <video
                                key={video._id}
                                src={videoUrl}
                                controls
                                playsInline
                                className="aspect-video w-full"
                                poster={video.thumbnail}
                            >
                                Your browser does not support video playback.
                            </video>
                        ) : (
                            <div className="flex aspect-video items-center justify-center text-white">
                                Video URL is unavailable.
                            </div>
                        )}
                    </div>

                    <h1 className="mt-5 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                        {video.title || "Untitled video"}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 font-bold text-white">
                                {channelName.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {channelName}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {video.views ?? 0} views
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                disabled
                                title="Like functionality will be connected next"
                                className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500 dark:bg-zinc-800"
                            >
                                <ThumbsUp size={18} />
                                Like
                            </button>

                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        await navigator.clipboard.writeText(window.location.href);
                                    } catch {
                                        // Clipboard access may be unavailable in some browsers.
                                    }
                                }}
                                className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 dark:bg-zinc-800 dark:text-white"
                            >
                                <Share2 size={18} />
                                Share
                            </button>

                            <button
                                type="button"
                                disabled
                                aria-label="More options"
                                className="rounded-full bg-gray-100 p-2 text-gray-500 dark:bg-zinc-800"
                            >
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl bg-gray-100 p-4 dark:bg-zinc-900">
                        <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                            Description
                        </p>
                        <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                            {video.description || "No description provided."}
                        </p>
                    </div>

                    <section className="mt-8 border-t border-gray-200 pt-6 dark:border-zinc-800">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Comments
                        </h2>
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                            Comments functionality will be connected to your backend next.
                        </p>
                    </section>
                </section>

                <aside className="min-w-0">
                    <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                        Related videos
                    </h2>
                    <VideoGrid videos={relatedVideos} />
                </aside>
            </div>
        </main>
    );
}

export default WatchVideo;
