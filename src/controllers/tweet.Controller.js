import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweets.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import { User } from "../models/users.models.js";
import asyncHandler from "../utils/asyncHandler.js";


const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    const owner = req.user._id;
    if (!content?.trim()) {
        throw new ApiError(400, "content is required");
    }
    const tweet = await Tweet.create({ content, owner });
    return res.status(201).json(new ApiResponce(201, tweet, "tweet created successfully"));
});