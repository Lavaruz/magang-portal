const { User, Company, Employer, Job } = require("../models");
const response = require('./response')
const bcrypt = require('bcrypt')
const { createToken } = require("../utils/JWT");

function register(req, res) {
    try {
      const { firstname, lastname, password, email } = req.body;
      bcrypt.hash(password, 10).then((hash) => {
        User.create({
          firstname,
          lastname,
          email,
          password: hash,
        }).then(async (respon) => {
          const user = await User.findOne({
            where: {
              email: email,
            },
          });
          const accessToken = createToken(user);
          res.cookie("access-token", accessToken, {
            maxAge: 3600000,
          });
          response(201, "success create new user", respon, res);
        });
      });
    } catch (error) {
      response(
        500,
        "server failed to create new user",
        { error: error.message },
        res
      );
    }
  }

  async function login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email: email,
        },
      });

    //   kalau user tidak ditemukan return error
    if (user == null) return res.json({ error: "user not found" });
      
    const dbPassword = user.password;
    bcrypt.compare(password, dbPassword).then((match) => {
        if (!match) {
          res.json({ error: "wrong username and password combination" });
        } else {
          const accessToken = createToken(user);
          res.cookie("access-token", accessToken, {
            maxAge: 3600000,
          });
          response(200, "success login", [], res)
        }
    });
    } catch (error) {
      response(
        500,
        "server failed to login user",
        { error: error.message },
        res
      );
    }
  }
  
  async function logout(req, res, next) {
    if (req.user && req.user.googleAccessToken) {
      const googleRevokeUrl = `https://accounts.google.com/o/oauth2/revoke?token=${req.user.googleAccessToken}`;
      await fetch(googleRevokeUrl);
  
      console.log('Google token revoked');
    }
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  }

  async function getAllUser(req, res){
    try {
      await User.findAll({
        include: [
          {
            model: Company,
            as: 'Companies',
            include: [
              {
                model: Employer,
                as: 'Employers', // Pastikan sesuai dengan alias yang telah Anda tentukan dalam relasi
              },
              {
                model: Job,
                as: 'Jobs', // Pastikan sesuai dengan alias yang telah Anda tentukan dalam relasi
              },
            ],
          },
        ],
      })
        .then(result => {
          response(200, "success get all user", result, res)
        })
    } catch (error) {
      response(
        500,
        "server failed to get all user",
        { error: error.message },
        res
      );
    }
  }

  async function getUserByToken(req, res){
    try {
      console.log(req.user);
      await User.findOne({
        where:{
          email: req.user.email
        },
        include: [
          {
            model: Company,
            as: 'Companies',
            include: [
              {
                model: Employer,
                as: 'Employers', // Pastikan sesuai dengan alias yang telah Anda tentukan dalam relasi
              },
              {
                model: Job,
                as: 'Jobs', // Pastikan sesuai dengan alias yang telah Anda tentukan dalam relasi
              },
            ],
          },
        ],
      })
        .then(result => {
          response(200, "success get all user", result, res)
        })
    } catch (error) {
      response(
        500,
        "server failed to get all user",
        { error: error.message },
        res
      );
    }
  }

  module.exports = {
    login,
    register,
    logout,
    getAllUser,
    getUserByToken
  }