import {
  createMahasiswa,
  getAllMahasiswa,
  getMahasiswaById,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controllers/mahasiswa.controller";
import express from "express";

const mahasiswaRouter = express.Router();

mahasiswaRouter.get("/", getAllMahasiswa);
mahasiswaRouter.get("/:id", getMahasiswaById);
mahasiswaRouter.post("/", createMahasiswa);
mahasiswaRouter.put("/:id", updateMahasiswa);
mahasiswaRouter.delete("/:id", deleteMahasiswa);

export default mahasiswaRouter;
