import commentModel,{IComment} from "../models/Comments_model";
import mongoose from "mongoose";
import { Request, Response } from "express";
import createController from "./base_controller";

const commentsController= createController<IComment>(commentModel);

export default commentsController; 