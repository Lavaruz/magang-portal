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
import Gallery from "../models/Gallery";
import Post from "../models/Post";
  

export const getAllRecruiter = async (req: Request, res: Response) => {
  try {
    const recruiters = await Recruiter.findAll({attributes:{exclude:["createdAt","updatedAt"]}, include:[
      {model:Gallery, as:"gallery", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Post, as:"posts", attributes:{exclude:["createdAt","updatedAt","ownerId"]}, through:{attributes:[]}}
    ]});
    response(200, "success call all recruiter", recruiters, res);
  } catch (error) {
    console.error("Gagal mengambil data pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getRecruiterById = async (req: Request, res: Response) => {
    const recruiterId = req.params.id;

    try {
        const recruiter = await Recruiter.findByPk(recruiterId,{attributes:{exclude:["createdAt","updatedAt"]}, include:[
          {model:Gallery, as:"gallery", attributes:{exclude:["createdAt","updatedAt","ownerId"]}},
          {model:Post, as:"posts", attributes:{exclude:["createdAt","updatedAt","ownerId"]}, include:[
            {model:Seeker, as: "applicants",attributes:{exclude:["createdAt","updatedAt","ownerId"]}}
          ] ,through:{attributes:[]}},
        ]});
        if (recruiter) {
        res.status(200).json(recruiter);
        } else {
        res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const updateRecruiter = async (req: Request, res: Response) => {
    const recruiterId = req.params.id;
    console.log(req.params);
    
    const updatedRecruiter = req.body; // Data pembaruan pengguna dari permintaan PUT  
  
    try {
      const recruiter = await Recruiter.findByPk(recruiterId);
      if (recruiter) {
  
        // Menambahakan URL Image ke dalam gambar, 
        // dan menghapus gambar lama ketika upload gambar baru
        
        if(req.files.length !== 0){
          if(req.files[0].fieldname == "org-banner"){

            if(recruiter.rec_banner){
              const fileToDelete = `public/files/uploads/${recruiter.rec_banner.split("uploads/")[1]}`
              if (fs.existsSync(fileToDelete)) {
                try {
                  fs.unlinkSync(fileToDelete);
                  console.log(`File ${recruiter.rec_banner.split("uploads/")[1]} deleted successfully.`);
                } catch (err) {
                  console.error(`Error deleting file ${recruiter.rec_banner.split("uploads/")[1]}: ${err}`);
                }
              } else {
                console.log(`File ${recruiter.rec_banner.split("uploads/")[1]} not found.`);
              } 
            }
  
            req.body.rec_banner = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`
          }else if(req.files[0].fieldname == "rec-org-logo"){
            if(recruiter.rec_org_logo){
              const fileToDelete = `public/files/uploads/${recruiter.rec_org_logo.split("uploads/")[1]}`
              if (fs.existsSync(fileToDelete)) {
                try {
                  fs.unlinkSync(fileToDelete);
                  console.log(`File ${recruiter.rec_org_logo.split("uploads/")[1]} deleted successfully.`);
                } catch (err) {
                  console.error(`Error deleting file ${recruiter.rec_org_logo.split("uploads/")[1]}: ${err}`);
                }
              } else {
                console.log(`File ${recruiter.rec_org_logo.split("uploads/")[1]} not found.`);
              } 
            }
  
            req.body.rec_org_logo = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`

          }
        }
        
        
        await recruiter.update(updatedRecruiter);
        response(200, "Success update pengguna", recruiter, res)
      } else {
        res.status(404).json({ error: "Pengguna tidak ditemukan" });
      }
    } catch (error) {
      console.error("Gagal memperbarui pengguna:", error);
      res.status(500).json({ error: "Server error" });
    }
};


// GALLERY

export const addGallery = async (req: Request, res: Response) => {
  const recruiterId = req.params.id;
  const galleryData = req.body; // Data pembaruan pengguna dari permintaan PUT

  try {
    const recruiter = await Recruiter.findByPk(recruiterId);
    if (recruiter) {
      if(req.files.length !== 0){
        if(req.files[0].fieldname == "rec-gallery"){

          // if(recruiter){
          //   const fileToDelete = `public/files/uploads/${recruiter.rec_banner.split("uploads/")[1]}`
          //   if (fs.existsSync(fileToDelete)) {
          //     try {
          //       fs.unlinkSync(fileToDelete);
          //       console.log(`File ${recruiter.rec_banner.split("uploads/")[1]} deleted successfully.`);
          //     } catch (err) {
          //       console.error(`Error deleting file ${recruiter.rec_banner.split("uploads/")[1]}: ${err}`);
          //     }
          //   } else {
          //     console.log(`File ${recruiter.rec_banner.split("uploads/")[1]} not found.`);
          //   } 
          // }

          req.body.gal_photo = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`
        }
      }
      


      await Gallery.create(galleryData).then(async function(result){
        await recruiter.addGallery(result)
        response(200, "Success update pengguna", recruiter, res)
      })
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// POST

export const addPost = async (req: Request, res: Response) => {
  let postData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
  const recruiterId = req.params.id
  try {
    const recruiter = await Recruiter.findByPk(recruiterId);

    if(postData.post_resume_req) postData.post_resume_req = true
    if(postData.post_portfolio_req) postData.post_portfolio_req = true
    console.log(postData.post_thp);
    
    if(postData.post_thp_min && !postData.post_thp_max) postData.post_thp = `Rp.${postData.post_thp_min}+`
    if(!postData.post_thp_min && postData.post_thp_max) postData.post_thp = `Rp.0-Rp.${postData.post_thp_max}`
    if(postData.post_thp_min && postData.post_thp_max) postData.post_thp = `Rp.${postData.post_thp_min}-Rp.${postData.post_thp_max}`
    
    if (recruiter) {
      await Post.create(postData).then(async function(result){
        await recruiter.addPost(result)
        response(200, "Success update pengguna", recruiter, res)
      })
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal membuat pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};