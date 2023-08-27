const userController = require('../controllers/userController')
const router = require("express").Router()
const {validateToken} = require('../utils/JWT')
const passport = require('passport')

router.get("/", userController.getAllUser);
router.get("/token",validateToken, userController.getUserByToken);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// google passport authentication
router.get('/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/employer/jobs');
    });

module.exports = router