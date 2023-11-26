"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_controller_1 = require("../controllers/post.controller");
const express_1 = __importDefault(require("express"));
const postRouter = express_1.default.Router();
postRouter.get("/", post_controller_1.getAllPost);
postRouter.get("/:id", post_controller_1.getPostById);
postRouter.put("/:id", post_controller_1.updatePosts);
exports.default = postRouter;
//# sourceMappingURL=post.router.js.map