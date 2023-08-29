const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const LocalStrategy = require("passport-local").Strategy
const path = require('path')
const { User } = require("../models");
const bcrypt = require('bcrypt')
const { Op } = require('sequelize');
require("dotenv").config({ path: path.resolve(__dirname + "/./../../.env") });

// LOCAL PASSPORT AUTH
passport.use(new LocalStrategy(
    async function(username, password, done) {
      await User.findOne({ 
        where: {
            email: username
        }
       })
        .then(result => {
            if (!result) return done(null, false)
            bcrypt.compare(password, result.password, function(err, match){
                if (err){
                    return done(err)
                }else if (match){
                    return done(err, result)
                }else{
                    return done(err, false)
                }
            })
        })
    }
));


// GOOGLE AUTHENTICAITON
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/users/google/callback"
  },
  async function(request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    await User.findOne({
      where: {
        googleId: profile.id
      }
    }).then(async (result) => {
      if(!result){
        await User.create({
          googleId: profile.id,
          firstname: profile._json.given_name,
          lastname: profile._json.family_name,
          username: profile._json.username
        })
        done(null, profile)
      }else{
        done(null, profile)
      }
    })
  }
));

passport.serializeUser((user, done) =>{
    done(null, user.id)
})
passport.deserializeUser(async (userId, done) =>{
  await User.findOne({
    where:{
        [Op.or]: [
            { id: userId }, // Kondisi pertama
            { googleId: userId }, // Kondisi kedua
        ]
    }
    }).then(result => {      
        done(null, result)
    })
})