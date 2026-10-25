
import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";

function formatViews(views = 0) {
    if (views >= 1_000_000) {
        return `${(views / 1_000_000).toFixed(1)}M views`;
    }

    if (views >= 1_000) {
        return `${(views / 1_000).toFixed(1)}K views`;
    }

    return `${views} views`;
}

function VideoCard({ video }) {
    if (!video) return null;

    const videoId = video._id;
    const title = video.title || "Untitled video";
    const thumbnail = video.thumbnail;
    const channelName =
        video.owner?.fullName ||
        video.owner?.username ||
        video.owner?.name ||
        "Unknown channel";

    const views = video.views ?? 0;
    const uploadedAt = video.createdAt
        ? new Date(video.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        : "";

    return (
        <article className="group min-w-0">
            <Link
                to={`/watch/${videoId}`}
                className="block overflow-hidden rounded-xl bg-gray-200 dark:bg-zinc-800"
                aria-label={`Watch ${title}`}
            >
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={title}
                        loading="lazy"
                        className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex aspect-video items-center justify-center text-sm text-gray-500">
                        Thumbnail unavailable
                    </div>
                )}
            </Link>

            <div className="mt-3 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                    {channelName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                    <Link
                        to={`/watch/${videoId}`}
                        className="line-clamp-2 font-semibold leading-5 text-gray-900 hover:text-red-600 dark:text-white"
                        title={title}
                    >
                        {title}
                    </Link>

                    <p className="mt-1 truncate text-sm text-gray-600 dark:text-gray-400">
                        {channelName}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatViews(views)}
                        {uploadedAt && ` · ${uploadedAt}`}
                    </p>
                </div>

                <button
                    type="button"
                    aria-label="More video options"
                    className="rounded-full p-1 text-gray-600 opacity-0 hover:bg-gray-200 group-hover:opacity-100 dark:text-gray-300 dark:hover:bg-zinc-700"
                >
                    <MoreVertical size={20} />
                </button>
            </div>
        </article>
    );
}

export default VideoCard;
