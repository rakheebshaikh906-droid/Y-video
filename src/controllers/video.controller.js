import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    //first craete a pipeline lookup for videos users and his id
    //then check if userId is present in query then match the userId with owner id
    //then check if query is present in query then match the query with title
    //then check if sortBy is present in query then match the sortBy with createdAt
    //then check if sortType is present in query then match the sortType with desc
    //then sort the videos by createdAt
    //then paginate the videos by page and limit
    //then return the videos with status 200 and message "Videos fetched successfully"

    const {
        page = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "desc",
        userId
    } = req.query;

    const pipeline = [
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        }
    ];

    if (userId) {

        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user id");
        }

        pipeline.push({
            $match: {
                "owner._id": new mongoose.Types.ObjectId(userId)
            }
        });
    }

    if (query?.trim()) {
        pipeline.push({
            $match: {
                title: {
                    $regex: query,
                    $options: "i"
                }
            }
        });
    }

    const allowedSortFields = ["createdAt", "title"];

    const finalSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    pipeline.push({
        $sort: {
            [finalSortBy]: sortType === "asc" ? 1 : -1
        }
    });

    const videos = await Video.aggregatePaginate(
        Video.aggregate(pipeline),
        {
            page: Number(page),
            limit: Number(limit)
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "Videos fetched successfully"
            )
        );
});