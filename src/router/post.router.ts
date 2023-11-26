import { getAllPost, getPostById, updatePosts } from "../controllers/post.controller";
import express from "express";
    
const postRouter = express.Router();

postRouter.get("/", getAllPost)
postRouter.get("/:id", getPostById)
postRouter.put("/:id", updatePosts)
    
export default postRouter;
    