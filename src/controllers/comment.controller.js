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

const updateComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment");
    }
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $set: req.body },
        { new: true, runValidators: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                updatedComment,
                "Comment updated successfully"
            )
        );
})

const deleteComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json(new ApiResponce(200, null, "Comment deleted successfully"));
})

export { addComment, updateComment };