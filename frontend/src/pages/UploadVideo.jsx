
import { useState } from "react";
import { Link } from "react-router-dom";
import { Upload, ImagePlus, Video, X, ArrowLeft } from "lucide-react";
import { apiRequest } from "../services/api";

function UploadVideo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleThumbnailChange(event) {
        const file = event.target.files?.[0];

        if (!file) return;

        if (thumbnailPreview) {
            URL.revokeObjectURL(thumbnailPreview);
        }

        setThumbnail(file);
        setThumbnailPreview(URL.createObjectURL(file));
    }

    function removeThumbnail() {
        if (thumbnailPreview) {
            URL.revokeObjectURL(thumbnailPreview);
        }

        setThumbnail(null);
        setThumbnailPreview("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!videoFile || !thumbnail) {
            setError("Please select both a video and a thumbnail.");
            return;
        }

        if (!title.trim()) {
            setError("Please enter a video title.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("videoFile", videoFile);
        formData.append("thumbnail", thumbnail);

        try {
            setLoading(true);

            const response = await apiRequest("/videos/", {
                method: "POST",
                body: formData,
            });

            setSuccess(response?.message || "Video uploaded successfully!");

            setTitle("");
            setDescription("");
            setVideoFile(null);
            setThumbnail(null);
            removeThumbnail();

            event.target.reset();
        } catch (err) {
            setError(err.message || "Video upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-white px-4 py-8 dark:bg-black sm:px-8">
            <div className="mx-auto max-w-3xl">
                <Link
                    to="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 dark:text-gray-300"
                >
                    <ArrowLeft size={18} />
                    Back to home
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Upload video
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Share your video with the YVideo community.
                    </p>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        role="status"
                        className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
                    >
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="rounded-2xl border border-gray-200 p-5 dark:border-zinc-800 sm:p-7">
                        <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
                            Video details
                        </h2>

                        <label
                            htmlFor="videoTitle"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            Title *
                        </label>
                        <input
                            id="videoTitle"
                            type="text"
                            required
                            maxLength={100}
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Add a title that describes your video"
                            className="mt-2 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-gray-900 outline-none focus:border-red-600 dark:border-zinc-700 dark:text-white"
                        />

                        <div className="mt-5 flex items-center justify-between">
                            <label
                                htmlFor="videoDescription"
                                className="text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                                Description
                            </label>
                            <span className="text-xs text-gray-500">
                                {description.length}/5000
                            </span>
                        </div>
                        <textarea
                            id="videoDescription"
                            rows={5}
                            maxLength={5000}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Tell viewers about your video"
                            className="mt-2 w-full resize-y rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-gray-900 outline-none focus:border-red-600 dark:border-zinc-700 dark:text-white"
                        />
                    </section>

                    <section className="rounded-2xl border border-gray-200 p-5 dark:border-zinc-800 sm:p-7">
                        <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
                            Video file *
                        </h2>

                        <label
                            htmlFor="videoFile"
                            className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 px-5 py-10 text-center transition hover:border-red-500 dark:border-zinc-700"
                        >
                            <Video size={36} className="text-red-600" />

                            <span className="mt-3 font-medium text-gray-900 dark:text-white">
                                {videoFile ? videoFile.name : "Choose a video file"}
                            </span>

                            <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Select a video from your device
                            </span>

                            <span className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 dark:bg-zinc-800 dark:text-white">
                                Browse files
                            </span>

                            <input
                                id="videoFile"
                                type="file"
                                accept="video/*"
                                required
                                className="sr-only"
                                onChange={(event) =>
                                    setVideoFile(event.target.files?.[0] ?? null)
                                }
                            />
                        </label>

                        {videoFile && (
                            <button
                                type="button"
                                onClick={() => {
                                    setVideoFile(null);
                                    const input = document.getElementById("videoFile");
                                    if (input) input.value = "";
                                }}
                                className="mt-3 text-sm text-red-600 hover:underline"
                            >
                                Remove selected video
                            </button>
                        )}
                    </section>

                    <section className="rounded-2xl border border-gray-200 p-5 dark:border-zinc-800 sm:p-7">
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Thumbnail *
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Choose an image to represent your video.
                            </p>
                        </div>

                        {thumbnailPreview ? (
                            <div>
                                <img
                                    src={thumbnailPreview}
                                    alt="Selected video thumbnail preview"
                                    className="aspect-video w-full rounded-xl object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        removeThumbnail();
                                        const input = document.getElementById("thumbnail");
                                        if (input) input.value = "";
                                    }}
                                    className="mt-3 inline-flex items-center gap-2 text-sm text-red-600 hover:underline"
                                >
                                    <X size={16} />
                                    Remove thumbnail
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="thumbnail"
                                className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 px-5 py-10 text-center hover:border-red-500 dark:border-zinc-700"
                            >
                                <ImagePlus size={36} className="text-red-600" />
                                <span className="mt-3 font-medium text-gray-900 dark:text-white">
                                    Upload thumbnail
                                </span>
                                <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Choose an image file from your device
                                </span>
                            </label>
                        )}

                        <input
                            id="thumbnail"
                            type="file"
                            accept="image/*"
                            required
                            className="sr-only"
                            onChange={handleThumbnailChange}
                        />
                    </section>

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Upload size={20} />
                        {loading ? "Uploading..." : "Upload video"}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default UploadVideo;
