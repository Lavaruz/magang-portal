const router = require("express").Router();
const {validateRedirect} = require('../utils/JWT')

router.get("/", (req, res) => {
  res.render("jobseekerIndex");
});
router.get("/jobseeker/job-board", (req, res) => {
  res.render("jobseekerJobs");
});
router.get("/jobseeker/apply", (req, res) => {
  res.render("jobseekerApply");
});


// EMPLOYER

router.get("/employer", (req, res) => {
  res.render("employerIndex");
});
router.get("/employer/jobs", isAuthentication, (req, res) => {
  res.render("employerJobs");
});
router.get("/employer/hiring",isAuthentication, (req, res) => {
  res.render("employerHiring");
});
router.get("/employer/sign-up", (req, res) => {
  if(req.isAuthenticated()) return res.redirect('/employer/jobs')
  res.render("employerSignup");
});

// AUTH

router.get("/login", (req, res) => {
  if(req.isAuthenticated()) return res.redirect('/employer/jobs')
  res.render("Login");
});
router.get("/sign-up", (req, res) => {
  if(req.isAuthenticated()) return res.redirect('/employer/jobs')
  res.render("Signup");
});


// MIDDLEWARE AUTHENTICATION
function isAuthentication(req,res,next){
  if(req.isAuthenticated()) return next()
  else return res.redirect('/login')
}

module.exports = router;
