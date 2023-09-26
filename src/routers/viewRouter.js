const router = require("express").Router();
const {validateRedirect} = require('../utils/JWT')

router.get("/", (req, res) => {
  res.render("SeekerProfilePage");
});
router.get("/1", (req, res) => {
  res.render("SeekerInternshipPage");
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
