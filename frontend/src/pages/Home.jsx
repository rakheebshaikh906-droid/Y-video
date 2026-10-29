
import { useEffect, useState } from "react";
import CategoryBar from "../components/CategoryBar";
import VideoGrid from "../components/VideoGrid";
import { getAllVideos } from "../services/videoService";

function Home({ searchQuery = "", onSearchClear }) {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function fetchVideos() {
            try {
                setLoading(true);
                setError("");

                const response = await getAllVideos({
                    page: 1,
                    limit: 12,
                    query: searchQuery,
                });

                const videoList =
                    response?.data?.docs ??
                    response?.data?.videos ??
                    response?.data?.results ??
                    [];

                if (!Array.isArray(videoList)) {
                    throw new Error("Unexpected videos API response format");
                }

                if (!cancelled) {
                    setVideos(videoList);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message || "Videos load nahi ho paayi. Please try again."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchVideos();

        return () => {
            cancelled = true;
        };
    }, [searchQuery]);

    function handleCategoryChange(category) {
        setSelectedCategory(category);

        // Backend abhi sirf title search support karta hai.
        // Category filtering ko alag se implement karna hoga.
        if (category !== "All") {
            setError(`"${category}" category filtering abhi available nahi hai.`);
        } else {
            setError("");
        }
    }

    return (
        <main className="min-h-screen bg-white px-4 py-5 dark:bg-black sm:px-6">
            <CategoryBar onCategoryChange={handleCategoryChange} />

            <section>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {searchQuery
                            ? `Search results for "${searchQuery}"`
                            : selectedCategory === "All"
                                ? "Recommended videos"
                                : selectedCategory}
                    </h1>

                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => {
                                onSearchClear?.();
                                setSelectedCategory("All");
                            }}
                            className="text-sm font-medium text-red-600 hover:underline"
                        >
                            Clear search
                        </button>
                    )}
                </div>

                <VideoGrid
                    videos={videos}
                    loading={loading}
                    error={error}
                />
            </section>
        </main>
    );
}

export default Home;
