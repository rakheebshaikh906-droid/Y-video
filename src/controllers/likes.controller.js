import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.models.js"
import { Like } from "../models/likes.models.js"
import { Tweet } from "../models/tweets.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponce } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    //videoId nikalenge
    //phir woh id ko validation karenge
    //phir woh id se video nikalenge
    //video validation karenge 
    //video pe pehle se like hai kya nhi woh check karenge 
    //agar pehle se like raha tuh delete karenge
    //agar nhi raha tuh create karenge
    //dono ka alag alag response send karenge 

    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    if (existingLike) {

        await Like.findByIdAndDelete(existingLike._id);

        return res.status(200).json(
            new ApiResponce(
                200,
                {
                    liked: false
                },
                "Video unliked successfully"
            )
        );
    }

    await Like.create({
        video: videoId,
        likedBy: req.user._id
    });

    return res.status(200).json(
        new ApiResponce(
            200,
            {
                liked: true
            },
            "Video liked successfully"
        )
    );
});

const toggleTweetLikes = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    });

    if (existingLike) {

        await Like.findByIdAndDelete(existingLike._id);

        return res.status(200).json(
            new ApiResponce(
                200,
                {
                    liked: false
                },
                "Tweet unliked successfully"
            )
        );
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    });

    return res.status(200).json(
        new ApiResponce(
            200,
            {
                liked: true
            },
            "Tweet liked successfully"
        )
    );

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res.status(200).json(
            new ApiResponce(
                200,
                {
                    liked: false
                },
                "Comment unliked successfully"
            )
        );
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user._id
    });

    return res.status(200).json(
        new ApiResponce(
            200,
            {
                liked: true
            },
            "Comment liked successfully"
        )
    );
})

const getLikesVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }
    const likes = await Like.find({ video: videoId });
    return res
        .status(200)
        .json(
            new ApiResponce(
                200, likes, "likes fetched successfully"
            ));
})
export { toggleVideoLike, toggleTweetLikes, toggleCommentLike, getLikesVideo }