import {
  createSeeker,
  getAllSeeker,
  getSeekerById,
  updateSeeker,
  deleteSeeker,
  loginSeeker,
  addExperience,
  deleteExperience,
  addEducation,
  setAttachment,
  deleteEducation,
} from "../controllers/seeker.controller";
import express from "express";

const mahasiswaRouter = express.Router();

mahasiswaRouter.get("/", getAllSeeker);
mahasiswaRouter.get("/:id", getSeekerById);
mahasiswaRouter.post("/register", createSeeker);
mahasiswaRouter.post("/login", loginSeeker);
mahasiswaRouter.post("/:id/experience", addExperience);
mahasiswaRouter.post("/:id/education", addEducation);
mahasiswaRouter.post("/:id/attachment", setAttachment);
mahasiswaRouter.put("/:id", updateSeeker);
mahasiswaRouter.delete("/:id", deleteSeeker);
mahasiswaRouter.delete("/:id/experience/:deletionId", deleteExperience);
mahasiswaRouter.delete("/:id/education/:deletionId", deleteEducation);

export default mahasiswaRouter;
