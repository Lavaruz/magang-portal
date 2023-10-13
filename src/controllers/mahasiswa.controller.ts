import { Request, Response } from "express";
import Mahasiswa from "../models/Mahasiswa"; // Pastikan Anda telah mengimpor model User yang sesuai
import response from "./response";

// Fungsi ini mengambil semua pengguna
export const getAllMahasiswa = async (req: Request, res: Response) => {
  try {
    const mahasiswa = await Mahasiswa.findAll();
    response(200, "success call all mahasiswa", mahasiswa, res);
  } catch (error) {
    console.error("Gagal mengambil data pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fungsi ini mengambil satu pengguna berdasarkan ID
export const getMahasiswaById = async (req: Request, res: Response) => {
  const mahasiswaId = req.params.id;

  try {
    const mahasiswa = await Mahasiswa.findByPk(mahasiswaId);
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
export const createMahasiswa = async (req: Request, res: Response) => {
  const mahasiswaData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST

  try {
    const newMahasiswa = await Mahasiswa.create(mahasiswaData);
    res.status(201).json(newMahasiswa);
  } catch (error) {
    console.error("Gagal membuat pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fungsi ini memperbarui pengguna berdasarkan ID
export const updateMahasiswa = async (req: Request, res: Response) => {
  const mahasiswaId = req.params.id;
  const updatedMahasiswa = req.body; // Data pembaruan pengguna dari permintaan PUT

  try {
    const mahasiswa = await Mahasiswa.findByPk(mahasiswaId);
    if (mahasiswa) {
      await mahasiswa.update(updatedMahasiswa);
      res.status(200).json(mahasiswa);
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fungsi ini menghapus pengguna berdasarkan ID
export const deleteMahasiswa = async (req: Request, res: Response) => {
  const mahasiswaId = req.params.id;

  try {
    const mahasiswa = await Mahasiswa.findByPk(mahasiswaId);
    if (mahasiswa) {
      await mahasiswa.destroy();
      res.status(204).end(); // Mengembalikan 204 No Content jika pengguna berhasil dihapus
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal menghapus pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};
