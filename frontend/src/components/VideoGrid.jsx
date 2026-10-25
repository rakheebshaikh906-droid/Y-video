
import VideoCard from "./VideoCard";
import Loader from "./Loader";

function VideoGrid({
    videos = [],
    loading = false,
    error = "",
}) {
    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="py-12 text-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!videos.length) {
        return (
            <div className="py-16 text-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    No videos found
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Videos uploaded to your account will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
            ))}
        </div>
    );
}

export default VideoGrid;
