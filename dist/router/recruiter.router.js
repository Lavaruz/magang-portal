"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recruiter_controller_1 = require("../controllers/recruiter.controller");
const express_1 = __importDefault(require("express"));
const recruiterRouter = express_1.default.Router();
recruiterRouter.get("/", recruiter_controller_1.getAllRecruiter);
recruiterRouter.get("/:id", recruiter_controller_1.getRecruiterById);
recruiterRouter.post("/:id/gallery", recruiter_controller_1.addGallery);
recruiterRouter.post("/:id/post", recruiter_controller_1.addPost);
recruiterRouter.put("/:id", recruiter_controller_1.updateRecruiter);
exports.default = recruiterRouter;
//# sourceMappingURL=recruiter.router.js.map