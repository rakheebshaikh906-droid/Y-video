
import { useEffect, useState } from "react";
import CategoryBar from "../components/CategoryBar";
import VideoGrid from "../components/VideoGrid";
import { getAllVideos } from "../services/videoService";

function Home() {
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

                const response = await getAllVideos();

                // API response mein videos kis property mein hain,
                // uske hisaab se data extract karenge.
                const videoList =
                    response?.data?.videos ??
                    response?.data?.docs ??
                    response?.data ??
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
                        err.message ||
                        "Videos load nahi ho paayi. Please try again."
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
    }, []);

    return (
        <main className="min-h-screen bg-white px-4 py-5 dark:bg-black sm:px-6">
            <CategoryBar onCategoryChange={setSelectedCategory} />

            <section>
                <h1 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
                    {selectedCategory === "All"
                        ? "Recommended videos"
                        : selectedCategory}
                </h1>

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

//home.jsx 
