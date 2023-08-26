const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("jobseekerIndex");
});
router.get("/jobseeker/job-board", (req, res) => {
  res.render("jobseekerJobs");
});
router.get("/jobseeker/sign-up", (req, res) => {
  res.render("jobseekerSignup");
});
router.get("/jobseeker/apply", (req, res) => {
  res.render("jobseekerApply");
});


// EMPLOYER

router.get("/employer", (req, res) => {
  res.render("employerIndex");
});
router.get("/employer/jobs", (req, res) => {
  res.render("employerJobs");
});
router.get("/employer/hiring", (req, res) => {
  res.render("employerHiring");
});


// AUTH

router.get("/login", (req, res) => {
  res.render("Login");
});
router.get("/sign-up", (req, res) => {
  res.render("Signup");
});

module.exports = router;
