"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Comments_model_1 = __importDefault(require("../models/Comments_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const commentsController = (0, base_controller_1.default)(Comments_model_1.default);
exports.default = commentsController;
//# sourceMappingURL=comment_controllers.js.map