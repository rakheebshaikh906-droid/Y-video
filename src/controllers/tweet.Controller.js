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

const getUserTweets = asyncHandler(async (req, res) => {
    //pehle apun uski id nikaleninge 
    //phir check karenge uski id pe se usne kitne tweets kara hai

    const user = req.user;
    const tweets = await Tweet.find({ owner: user._id });
    return res.status(200).json(new ApiResponce(200, tweets, "tweets fetched successfully"));

});

const updateTweet = asyncHandler(async (req, res) => {

    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet");
    }
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { $set: req.body },
        { new: true, runValidators: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                updatedTweet,
                "Tweet updated successfully"
            )
        );
});

const deleteTweets = asyncHandler(async (req, res) => {
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet");
    }

    await Tweet.findByIdAndDelete(tweetId);
    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                null,
                "Tweet deleted successfully"
            )
        );

});

export { createTweet, getUserTweets, updateTweet };