// const passport = require('passport')
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const path = require('path')
// const { User } = require("../models");
// require("dotenv").config({ path: path.resolve(__dirname + "/./../../.env") });

// passport.use(new GoogleStrategy({
//     clientID:     process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/api/users/google/callback"
//   },
//   async function(request, accessToken, refreshToken, profile, done) {
//     await User.findOne({
//       where: {
//         googleId: profile.id
//       }
//     }).then(async (result) => {
//       if(!result){
//         await User.create({
//           googleId: profile.id,
//           firstname: profile._json.given_name,
//           lastname: profile._json.family_name,
//           email: profile._json.email
//         })
//         done(null, profile)
//       }else{
//         done(null, profile)
//       }
//     })
//     return done(null, profile);
//   }
// ));

// passport.serializeUser((user, done) =>{
//     done(null, user.id)
// })
// passport.deserializeUser(async (userId, done) =>{
//   let user = await User.findOne({
//     where:{
//       googleId: userId
//     }
//   })
//     done(null, user)
// })