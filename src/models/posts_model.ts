import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    title: string;
    content: string;
    owner: mongoose.Types.ObjectId;
}

const postSchema = new Schema<IPost>({
    title: {
        type: String,
        required: true,
    },
    content: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const PostModel = mongoose.model<IPost>("Posts", postSchema);
export default PostModel;