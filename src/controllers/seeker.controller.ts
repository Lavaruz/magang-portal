import { Request, Response } from "express";
import Seeker from "../models/Seeker"; // Pastikan Anda telah mengimpor model User yang sesuai
import response from "./response";
import * as bcrypt from 'bcrypt';
import { createToken } from "../config/JTW";

// Fungsi ini mengambil semua pengguna
export const getAllSeeker = async (req: Request, res: Response) => {
  try {
    const seeker = await Seeker.findAll({attributes:{exclude:["createdAt","updatedAt"]}});
    response(200, "success call all seeker", seeker, res);
  } catch (error) {
    console.error("Gagal mengambil data pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fungsi ini mengambil satu pengguna berdasarkan ID
export const getSeekerById = async (req: Request, res: Response) => {
  const seekerId = req.params.id;

  try {
    const mahasiswa = await Seeker.findByPk(seekerId);
    if (mahasiswa) {
      res.status(200).json(mahasiswa);
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal mengambil data pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fungsi ini membuat pengguna baru
export const createSeeker = async (req: Request, res: Response) => {
  const seekerData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
  try {
    hashPassword(seekerData.password)
      .then(async(hashedPassword) => {
        seekerData.password = hashedPassword
        let newSeeker = await Seeker.create(seekerData);
        // Membut cookies untuk login
        const accessToken = createToken(newSeeker);
        res.cookie("access-token", accessToken, {
          maxAge: 3600000,
        });
        response(201, "success create new users", newSeeker, res)
      })
      .catch((error) => {
        console.error("Gagal membuat pengguna:", error);
        res.status(500).json({ error: "Server error" });
      });
  } catch (error) {
    console.error("Gagal membuat pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const loginSeeker = async (req: Request, res: Response) => {
  const seekerData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
  try {
    let seeker = await Seeker.findOne({
      where: {
        email: seekerData.email
      }
    })
    
    if (!seeker) return response(400, "seeker not found", [], res)
    bcrypt.compare(seekerData.password, seeker.password).then((match) => {
      if (!match) {
        return res.json({ error: "wrong username and password combination" });
      } else {
        const accessToken = createToken(seeker);
        res.cookie("access-token", accessToken, {
          maxAge: 3600000,
        });
        return response(200, "success login", seeker, res)
      }
    });
  } catch (error) {
    console.error("Gagal login pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fungsi ini memperbarui pengguna berdasarkan ID
export const updateSeeker = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const updatedSeeker = req.body; // Data pembaruan pengguna dari permintaan PUT

  try {
    const seeker = await Seeker.findByPk(seekerId);
    if (seeker) {
      await seeker.update(updatedSeeker);
      res.status(200).json(seeker);
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fungsi ini menghapus pengguna berdasarkan ID
export const deleteSeeker = async (req: Request, res: Response) => {
  const seekerId = req.params.id;

  try {
    const seeker = await Seeker.findByPk(seekerId);
    if (seeker) {
      await seeker.destroy();
      res.status(204).end(); // Mengembalikan 204 No Content jika pengguna berhasil dihapus
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal menghapus pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};
