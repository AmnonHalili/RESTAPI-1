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
const posts_model_1 = __importDefault(require("../models/posts_model"));
const base_controller_1 = require("./base_controller");
class PostController extends base_controller_1.BaseController {
    constructor() {
        super(posts_model_1.default);
    }
    AddANew(req, res) {
        const _super = Object.create(null, {
            AddANew: { get: () => super.AddANew }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const post = Object.assign(Object.assign({}, req.body), { owner: userId });
            req.body = post;
            _super.AddANew.call(this, req, res);
        });
    }
    ;
}
exports.default = new PostController();
//# sourceMappingURL=post_controller.js.map