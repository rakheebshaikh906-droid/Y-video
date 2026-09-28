import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const comment = new Schema({
    content: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    video: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }]
}, { timestamps: true });

comment.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", comment);