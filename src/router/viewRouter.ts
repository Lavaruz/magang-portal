import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("SeekerProfilePage");
});
router.get("/internships", (req, res) => {
  res.render("SeekerInternshipPage");
});
router.get("/recruiter-post", (req, res) => {
  res.render("RecruiterPost");
});

// AUTH
router.get("/login", (req, res) => {
  res.render("LoginRegisterPage");
});

export default router;
