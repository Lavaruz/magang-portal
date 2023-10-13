import express from "express";
import path from "path";
const app = express();

// Router import
// import db from "./models";
import { connectToDatabase } from "./models";
import viewRouter from "./router/viewRouter";
import mahasiswaRouter from "./router/mahasiswa.router";

app.use(express.json());
app.enable("trust proxy");

// konfigurasi static item dalam public folder
app.use("/", express.static(path.join(__dirname, "../public")));

// konfigurasi view engine "EJS"
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// konfigurasi sequelize dengan option alter
let PORT = process.env.PORT || 3000;
connectToDatabase()
  .then(() => {
    // set router
    const VERSION_API = "v1";
    app.use("/", viewRouter);
    app.use(`/api/${VERSION_API}/mahasiswa`, mahasiswaRouter);
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Koneksi database gagal:", error);
  });
