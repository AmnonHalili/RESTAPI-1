"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class BaseController {
    constructor(model) {
        this.model = model;
    }
    AddANew(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            try {
                const post = yield this.model.create(req.body);
                res.status(201).send(post);
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).send("Invalid ID format");
            }
            try {
                const deletedItem = yield this.model.findByIdAndDelete(id);
                if (!deletedItem) {
                    return res.status(404).send("Item not found");
                }
                res.send(deletedItem);
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = req.query;
            console.log(filter);
            try {
                if (filter.owner) {
                    const posts = yield this.model.find({ owner: filter.owner });
                    return res.send(posts);
                }
                else {
                    const posts = yield this.model.find();
                    return res.send(posts);
                }
            }
            catch (err) {
                return res.status(400).send(err);
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id;
            try {
                const post = yield this.model.findById(postId);
                if (post === null) {
                    return res.status(404).send("Post not found");
                }
                else {
                    return res.status(200).send(post);
                }
            }
            catch (err) {
                console.log(err);
                res.status(404).send(err);
            }
        });
    }
    updateA(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id;
            if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
                return res.status(400).send("Invalid post ID format");
            }
            try {
                const updatedPost = yield this.model.findByIdAndUpdate(postId, req.body, { new: true, runValidators: true });
                if (!updatedPost) {
                    return res.status(404).send("Post not found");
                }
                res.send(updatedPost);
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
}
exports.BaseController = BaseController;
const createController = (model) => {
    return new BaseController(model);
};
exports.default = createController;
//# sourceMappingURL=base_controller.js.map