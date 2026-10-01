import mongoose, { Schema } from "mongoose";

const playlist = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        required: true
    },
    thumbnail: {
        type: String
    },
    description: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }]
}, { timestamps: true });

export const Playlist = mongoose.model("Playlist", playlist);