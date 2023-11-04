import { Request, Response } from "express";
import Seeker from "../models/Seeker";
import Experience from "../models/Experience";
import Education from "../models/Education";
import response from "./response";
import * as bcrypt from 'bcrypt';
import { createToken } from "../config/JWT";
import Attachment from "../models/Attachment";
import path from "path";
import fs from "fs"
import Recruiter from "../models/Recruiter";


// Fungsi ini mengambil semua pengguna
export const getAllSeeker = async (req: Request, res: Response) => {
  try {
    const seeker = await Seeker.findAll({attributes:{exclude:["createdAt","updatedAt","password"]}, include:[
      {model:Experience, as:"experiences", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Education, as:"educations", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Attachment, as:"attachment", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Recruiter, as:"recruiter", attributes:{exclude:["createdAt","updatedAt"]}}
    ]});
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
    const mahasiswa = await Seeker.findByPk(seekerId,{attributes:{exclude:["createdAt","updatedAt","password"]}, include:[
      {model:Experience, as:"experiences", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Education, as:"educations", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Attachment, as:"attachment", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Recruiter, as:"recruiter", attributes:{exclude:["createdAt","updatedAt"]}}
    ]});
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
  seekerData.role = "seeker"
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

      // Menambahakan URL Image ke dalam gambar, 
      // dan menghapus gambar lama ketika upload gambar baru
      if(req.files.length !== 0){
        if(seeker.profile_picture){
          const fileToDelete = `public/files/uploads/${seeker.profile_picture.split("uploads/")[1]}`
          if (fs.existsSync(fileToDelete)) {
            try {
              fs.unlinkSync(fileToDelete);
              console.log(`File ${seeker.profile_picture.split("uploads/")[1]} deleted successfully.`);
            } catch (err) {
              console.error(`Error deleting file ${seeker.profile_picture.split("uploads/")[1]}: ${err}`);
            }
          } else {
            console.log(`File ${seeker.profile_picture.split("uploads/")[1]} not found.`);
          } 
        }
        req.body.profile_picture = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`
      }
      
      await seeker.update(updatedSeeker);
      response(200, "Success update pengguna", seeker, res)
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



// EXPERIENCES

// Fungsi ini membuat experience pengguna berdasarkan ID
export const addExperience = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const experienceData = req.body; // Data pembaruan pengguna dari permintaan PUT

  try {
    const seeker = await Seeker.findByPk(seekerId);
    if (seeker) {
      await Experience.create(experienceData).then(async function(result){
        await seeker.addExperience(result)
        response(200, "Success update pengguna", seeker, res)
      })
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const deletionId = req.params.deletionId

  try {
    const seeker = await Seeker.findByPk(seekerId);
    
    if (seeker) {
      // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
      const experience = await seeker.getExperiences({ where: { id: deletionId } });
      if (experience.length > 0) {
        // Jika pengalaman ditemukan, hapus pengalaman tersebut
        seeker.removeExperience(experience)
        await Experience.destroy({ where: { id: deletionId } });
        response(200, "Pengalaman berhasil dihapus", seeker, res);
      } else {
        res.status(404).json({ error: "Experience tidak ditemukan" });
      }
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const updateId = req.params.updateId

  try {
    const seeker = await Seeker.findByPk(seekerId);
    
    if (seeker) {
      // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
      const experience = await seeker.getExperiences({ where: { id: updateId } });
      if (experience.length > 0) {

        if (req.body.exp_enddate == null) req.body.exp_enddate = null
        
        await Experience.update(req.body,{ where: { id: updateId } });
        response(200, "Education berhasil diupdate", seeker, res);
      } else {
        res.status(404).json({ error: "Education tidak ditemukan" });
      }
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// EDUCATION

// Fungsi ini membuat education pengguna berdasarkan ID
export const addEducation = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const educationData = req.body; // Data pembaruan pengguna dari permintaan PUT

  try {
    const seeker = await Seeker.findByPk(seekerId);
    if (seeker) {
      await Education.create(educationData).then(async function(result){
        await seeker.addEducation(result)
        response(200, "Success update pengguna", seeker, res)
      })
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteEducation = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const deletionId = req.params.deletionId

  try {
    const seeker = await Seeker.findByPk(seekerId);
    
    if (seeker) {
      // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
      const education = await seeker.getEducations({ where: { id: deletionId } });
      if (education.length > 0) {
        // Jika pengalaman ditemukan, hapus pengalaman tersebut
        seeker.removeEducation(education)
        await Education.destroy({ where: { id: deletionId } });
        response(200, "Education berhasil dihapus", seeker, res);
      } else {
        res.status(404).json({ error: "Education tidak ditemukan" });
      }
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateEducation = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const updateId = req.params.updateId

  try {
    const seeker = await Seeker.findByPk(seekerId);
    
    if (seeker) {
      // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
      const education = await seeker.getEducations({ where: { id: updateId } });
      if (education.length > 0) {
        await Education.update(req.body,{ where: { id: updateId } });
        response(200, "Education berhasil diupdate", seeker, res);
      } else {
        res.status(404).json({ error: "Education tidak ditemukan" });
      }
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// ATTACHMENT
export const setAttachment = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const attachmentData = req.body; // Data pembaruan pengguna dari permintaan PUT
  

  try {
    const seeker = await Seeker.findByPk(seekerId);
    if (seeker) {
      // if user upload file resume
      let attachment = (await seeker.getAttachment())

      attachmentData.atc_resume = attachment ? attachment.atc_resume : null

      if(req.files.length !== 0){
        if(attachment){
          if(attachment.atc_resume){
            const filename = attachment.atc_resume.split("/uploads")[1]
            const fileToDelete = `public/files/uploads/${filename}`
            if (fs.existsSync(fileToDelete)) {
              try {
                fs.unlinkSync(fileToDelete);
                console.log(`File ${filename} deleted successfully.`);
              } catch (err) {
                console.error(`Error deleting file ${filename}: ${err}`);
              }
            } else {
              console.log(`File ${filename} not found.`);
            } 
          }
        }
        
        attachmentData.atc_resume = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`
      }
      
      // check if attachment not null delete previous data
      let attachmentId = attachment ? attachment.id : null
      
      if(attachmentId){
        await Attachment.update(attachmentData,{where:{id:attachmentId}})
        response(200, "Success update attachment", seeker, res)
      }else{
        // create new attachment
        await Attachment.create(attachmentData).then(async function(result){
          await seeker.setAttachment(result)
          response(200, "Success update pengguna", seeker, res)
        })
      }
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAttachment = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const fieldName = req.params.fieldName

  try {
    const seeker = await Seeker.findByPk(seekerId);
    
    if (seeker) {
      // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
      const attachmentData = (await seeker.getAttachment());
      if (attachmentData) {
        if (attachmentData[fieldName]) {
          attachmentData[fieldName] = null;
          await attachmentData.save()
          response(200, `${fieldName} berhasil dihapus`, seeker, res);
        } else {
          res.status(404).json({ error: `${fieldName} tidak ditemukan` });
        }
      } else {
        res.status(404).json({ error: "Attachment tidak ditemukan" });
      }
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// Recruiter Register
export const addRecruiter = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const recruiterData = req.body; // Data pembaruan pengguna dari permintaan PUT
  

  try {
    const seeker = await Seeker.findByPk(seekerId);
    if (seeker) {
      await Recruiter.create(recruiterData).then(async function(result){
        await seeker.setRecruiter(result)
        seeker.update({role:"recruiter"})
        response(200, "Success update pengguna", seeker, res)
      })
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

