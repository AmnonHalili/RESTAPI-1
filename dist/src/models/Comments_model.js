"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const commentSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});
const commentModel = mongoose_1.default.model("comments", commentSchema);
exports.default = commentModel;
//# sourceMappingURL=Comments_model.js.map