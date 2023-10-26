import express from "express";
import fs from "fs"
import path from "path";
import multer from 'multer';
import cookieParser from "cookie-parser"
import cors from "cors"
const app = express();

// for image upload
if (!fs.existsSync("public/files/uploads")) {
  if (!fs.existsSync("public/files")) {
    fs.mkdirSync("public/files");
  }
  if (!fs.existsSync("public/files/uploads")) {
    fs.mkdirSync("public/files/uploads");
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/files/uploads");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, Date.now() + Math.floor(Math.random() * 99) + 1 + "." + extension);
  },
});

// Router import
import { connectToDatabase } from "./models";
import viewRouter from "./router/viewRouter";
import seekerRouter from "./router/seeker.router";

app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(multer({ storage: storage, limits: { fileSize: 1000000 } }).any());
app.enable("trust proxy");

// konfigurasi static item dalam public folder
app.use("/", express.static(path.join(__dirname, "../public")));

// konfigurasi view engine "EJS"
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// konfigurasi sequelize dengan option alter
let PORT = process.env.PORT || 8080;
connectToDatabase()
  .then(() => {
    // set router
    const VERSION_API = "v1";
    app.use("/", viewRouter);
    app.use(`/api/${VERSION_API}/seeker`, seekerRouter);
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Koneksi database gagal:", error);
  });
