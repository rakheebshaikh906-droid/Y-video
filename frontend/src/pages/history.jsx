
import { useEffect, useState } from "react";
import { History as HistoryIcon } from "lucide-react";
import VideoGrid from "../components/VideoGrid";
import { apiRequest } from "../services/api";

function History() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function fetchWatchHistory() {
            try {
                setLoading(true);
                setError("");

                const response = await apiRequest("/users/watch-history");

                const historyVideos = response?.data;

                if (!Array.isArray(historyVideos)) {
                    throw new Error("Unexpected watch history response.");
                }

                if (!cancelled) {
                    setVideos(historyVideos);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Failed to load watch history.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchWatchHistory();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <main className="min-h-screen bg-white px-4 py-6 dark:bg-black sm:px-6">
            <div className="mb-6 flex items-center gap-3">
                <HistoryIcon size={28} className="text-gray-800 dark:text-white" />

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Watch History
                </h1>
            </div>

            <VideoGrid
                videos={videos}
                loading={loading}
                error={error}
            />
        </main>
    );
}

export default History;
