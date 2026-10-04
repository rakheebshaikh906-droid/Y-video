import mongoose from "mongoose"
import { Video } from "../models/video.models.js"
import { Subscriber } from "../models/subscriber.models.js"
import { Like } from "../models/likes.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponce } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelState = asyncHandler(async (req, res) => {
    //Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const totalVideos = await Video.countDocuments({ owner: channel._id });
    const totalSubscribers = await Subscriber.countDocuments({ channel: channel._id });
    const totalLikes = await Like.countDocuments({ video: { $in: channel.videos } });

    return res.status(200).json(
        new ApiResponce(
            200,
            {
                totalVideos,
                totalSubscribers,
                totalLikes
            },
            "Channel stats fetched successfully"
        )
    );
})

const getChannelVideos = asyncHandler(async (req, res) => {
    //get all videos uploaded by the channel
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const videos = await Video.find({ owner: channel._id });

    return res.status(200).json(
        new ApiResponce(
            200,
            videos,
            "Videos fetched successfully"
        )
    );
})

export { getChannelState, getChannelVideos }
