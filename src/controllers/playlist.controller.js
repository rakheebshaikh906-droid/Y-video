import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const owner = req.user._id;
    if (!name?.trim()) {
        throw new ApiError(400, "name is required");
    }
    const playlist = await Playlist.create({ name, description, owner });
    return res.status(201).json(new ApiResponse(201, playlist, "playlist created successfully"));
});