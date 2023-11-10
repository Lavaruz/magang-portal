import {
  addGallery,
  getAllRecruiter,
  getRecruiterById, 
  updateRecruiter,
  } from "../controllers/recruiter.controller";
  import express from "express";
  
  const recruiterRouter = express.Router();
  
  recruiterRouter.get("/", getAllRecruiter)
  recruiterRouter.get("/:id", getRecruiterById);
  recruiterRouter.post("/:id/gallery", addGallery);
  recruiterRouter.put("/:id", updateRecruiter);
  
  export default recruiterRouter;
  