import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IComment {
    comment: string;
    postId: string;
    owner: mongoose.Types.ObjectId;
}

const commentSchema = new Schema<IComment>({
    comment:{
        type:String,
        required:true,
    },
    postId:{
        type:String,
        required:true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
});
const commentModel= mongoose.model<IComment>("comments", commentSchema);
export default commentModel;