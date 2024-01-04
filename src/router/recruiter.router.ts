import {
  addGallery,
  addPost,
  getAllRecruiter,
  getRecruiterById, 
  updateRecruiter,
  verificationRecruiter,
  } from "../controllers/recruiter.controller";
  import express from "express";
  
  const recruiterRouter = express.Router();
  
  recruiterRouter.get("/", getAllRecruiter)
  recruiterRouter.get("/:id", getRecruiterById);
  recruiterRouter.post("/:id/gallery", addGallery);
  recruiterRouter.post("/:id/post", addPost);
  recruiterRouter.put("/:id", updateRecruiter);
  recruiterRouter.put("/:id/verification", verificationRecruiter);
  
  export default recruiterRouter;
  