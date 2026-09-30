import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
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
            new ApiResponse(
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
        new ApiResponse(
            200,
            {
                liked: true
            },
            "Video liked successfully"
        )
    );
});

const toggleTweetLikes = asyncHandler(async (req, res) => {

})

export { toggleVideoLike }