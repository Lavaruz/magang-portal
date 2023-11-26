import { Request, Response, query } from "express";
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
import { Op } from "sequelize";


export const getAllPost = async (req: Request, res: Response) => {
    try {
      let postQuery = req.query
      
      if(Object.keys(postQuery).length !== 0){
        const post = await Post.findAll({attributes:{exclude:["createdAt","updatedAt"]}, include:[
          {model:Recruiter, as: "recruiter",attributes:{exclude:["createdAt","updatedAt","ownerId"]}, through:{attributes:[]}},
          {model:Seeker, as: "applicants",attributes:{exclude:["createdAt","updatedAt","ownerId"]}},
          {model:Seeker, as: "saved",attributes:{exclude:["createdAt","updatedAt","ownerId"]}},
        ], where: {
          post_position:{
            [Op.like]:`%${postQuery.title}%`
          },
        }});
        return response(200, "success call posts by query", post, res);
      }
      
      const post = await Post.findAll({attributes:{exclude:["createdAt","updatedAt"]}, include:[
        {model:Recruiter, as: "recruiter",attributes:{exclude:["createdAt","updatedAt","ownerId"]}, through:{attributes:[]}},
        {model:Seeker, as: "applicants",attributes:{exclude:["createdAt","updatedAt","ownerId"]}},
        {model:Seeker, as: "saved",attributes:{exclude:["createdAt","updatedAt","ownerId"]}},
      ]});
      return response(200, "success call all posts", post, res);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      res.status(500).json({ error: "Server error" });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
      const post = await Post.findOne({where:{id:req.params.id},attributes:{exclude:["createdAt","updatedAt"]}, include:[
        {model:Recruiter, as: "recruiter",attributes:{exclude:["createdAt","updatedAt","ownerId"]}, through:{attributes:[]}},
        {model:Seeker, as: "applicants",attributes:{exclude:["createdAt","updatedAt","ownerId"]}},
        {model:Seeker, as: "saved",attributes:{exclude:["createdAt","updatedAt","ownerId"]}},
      ]});
      return response(200, "success call all posts", post, res);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      res.status(500).json({ error: "Server error" });
    }
};

export const updatePosts = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const updatedPost = req.body; // Data pembaruan pengguna dari permintaan PUT  

  try {
    const post = await Post.findByPk(postId);
    if (post) {
      await post.update(updatedPost);
      response(200, "Success update pengguna", post, res)
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};