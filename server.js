const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParse = require("cookie-parser");
const path = require("path");
const app = express();
// const session = require('express-session')
// const passport = require('passport')
// require('./src/utils/auth')

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.enable("trust proxy");
app.use(cookieParse())

// // konfigurasi untuk session passport
// app.use(session({
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }
// }))

// // konfigurasi untuk passport
// app.use(passport.initialize())
// app.use(passport.session())

app.use("/", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const db = require("./src/models");
const viewRouter = require("./src/routers/viewRouter");
const hiringRouter = require("./src/routers/hiringRouter");
const companyRouter = require("./src/routers/companyRouter");
const userRouter = require('./src/routers/userRouter');

const VERSION_API = "v1";
app.use("/", viewRouter);
app.use(`/api/hiring`, hiringRouter);
app.use(`/api/companys`, companyRouter);
app.use(`/api/users`, userRouter);

let PORT = process.env.PORT || 3000;
db.sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () =>
    console.log(
      "server run at port: " + PORT + ". go check: (http://localhost:3000/)"
    )
  );
});
