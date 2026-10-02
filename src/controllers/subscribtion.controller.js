import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
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

    const subscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channel._id
    });

    if (subscription) {
        await Subscription.findByIdAndDelete(subscription._id);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    subscribed: false
                },
                "Unsubscribed successfully"
            )
        );
    }

    const newSubscription = await Subscription.create({
        subscriber: req.user._id,
        channel: channel._id
    });

    return res.status(200).json(
        new ApiResponse(
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

    const subscriptions = await Subscription.find({
        subscriber: user._id,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            subscriptions,
            "Subscriptions fetched successfully"
        )
    );
})

export { toggleSubscription, getUserSubscriptions }