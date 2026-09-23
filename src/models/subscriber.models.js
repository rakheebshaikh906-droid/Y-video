import mongoose, { Schema } from "mongoose";

const SubScriber = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

export const Subscriber = mongoose.model("Subscriber", SubScriber);