import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const owner = req.user._id;
    const videoId = req.params.videoId;

    if (!content?.trim()) {
        throw new ApiError(400, "content is required");
    }
    const comment = await Comment.create({ content, owner, video: videoId });
    return res.status(201).json(new ApiResponce(201, comment, "comment created successfully"));
})

export { addComment };