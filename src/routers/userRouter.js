const userController = require('../controllers/userController')
const router = require("express").Router()
const passport = require('passport')

router.get("/", userController.getAllUser);
router.get("/token", userController.getUserByToken);
router.post("/register", userController.register);
router.post("/logout", userController.logout);

    
    // Local Authentication
router.post("/login", passport.authenticate('local', {
    successRedirect: "/employer/jobs",
    failureRedirect: "/login"
}));
    // Google Authentication
router.get('/google', passport.authenticate('google', { scope:
    [ 'email', 'profile' ] }
));
  
router.get('/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/employer/jobs',
        failureRedirect: '/login'
}));


module.exports = router