const router = require("express").Router();
const {validateRedirect} = require('../utils/JWT')

router.get("/", (req, res) => {
  res.render("SeekerProfilePage");
});
router.get("/internships", (req, res) => {
  res.render("SeekerInternshipPage");
});

// AUTH
router.get("/login", (req, res) => {
  res.render("LoginRegisterPage");
});


// MIDDLEWARE AUTHENTICATION
function isAuthentication(req,res,next){
  if(req.isAuthenticated()) return next()
  else return res.redirect('/login')
}

module.exports = router;
