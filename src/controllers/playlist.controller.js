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

const getUserPlaylists = asyncHandler(async (req, res) => {

    const user = req.user;

    const playlists = await Playlist.find({
        owner: user._id
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlists,
                "Playlists fetched successfully"
            )
        );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Playlist fetched successfully"
            )
        );
})
export { createPlaylist, getUserPlaylists, getPlaylistById }