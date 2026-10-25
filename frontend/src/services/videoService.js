
import { apiRequest } from "./api";

export async function getAllVideos({
    page = 1,
    limit = 12,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sortBy,
        sortType,
    });

    if (query.trim()) {
        params.set("query", query.trim());
    }

    return apiRequest(`/videos/?${params.toString()}`);
}

export async function getVideoById(videoId) {
    if (!videoId) {
        throw new Error("Video ID is required");
    }

    return apiRequest(`/videos/${encodeURIComponent(videoId)}`);
}
