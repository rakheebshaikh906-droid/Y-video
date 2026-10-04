import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/users.models.js"
import { Subscriber } from "../models/subscriber.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponce } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const subscription = await Subscriber.findOne({
        subscriber: req.user._id,
        channel: channel._id
    });

    if (subscription) {
        await Subscriber.findByIdAndDelete(subscription._id);

        return res.status(200).json(
            new ApiResponce(
                200,
                {
                    subscribed: false
                },
                "Unsubscribed successfully"
            )
        );
    }

    const newSubscription = await Subscriber.create({
        subscriber: req.user._id,
        channel: channel._id
    });

    return res.status(200).json(
        new ApiResponce(
            200,
            {
                subscribed: true
            },
            "Subscribed successfully"
        )
    );

})

const getUserSubscriptions = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const subscriptions = await Subscriber.find({
        subscriber: user._id,
    });

    return res.status(200).json(
        new ApiResponce(
            200,
            subscriptions,
            "Subscriptions fetched successfully"
        )
    );
})

const getSubscribedChannels = asyncHandler(async (req, res) => {

    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid user id");
    }

    const channels = await Subscriber.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel"
            }
        },
        {
            $unwind: "$channel"
        }
    ]);

    return res.status(200).json(
        new ApiResponce(
            200,
            channels,
            "Subscribed channels fetched successfully"
        )
    );
});

export { toggleSubscription, getUserSubscriptions, getSubscribedChannels }