import PostModel,{IPost} from "../models/posts_model";
import mongoose from "mongoose";
import { Request, Response } from "express";
import {BaseController} from "./base_controller";

class PostController extends BaseController<IPost>{
    constructor() {
        super(PostModel);
    }

    async AddANew(req: Request, res: Response) {
        const userId = req.params.userId;
        const post = {
            ...req.body,
            owner: userId
        }
        req.body = post;
        super.AddANew(req, res);
    }; 
}

export default new PostController();