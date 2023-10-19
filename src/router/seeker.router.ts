import {
  createSeeker,
  getAllSeeker,
  getSeekerById,
  updateSeeker,
  deleteSeeker,
  loginSeeker,
} from "../controllers/seeker.controller";
import express from "express";

const mahasiswaRouter = express.Router();

mahasiswaRouter.get("/", getAllSeeker);
mahasiswaRouter.get("/:id", getSeekerById);
mahasiswaRouter.post("/register", createSeeker);
mahasiswaRouter.post("/login", loginSeeker);
mahasiswaRouter.put("/:id", updateSeeker);
mahasiswaRouter.delete("/:id", deleteSeeker);

export default mahasiswaRouter;
