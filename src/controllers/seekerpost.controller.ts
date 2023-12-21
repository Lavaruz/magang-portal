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
import SeekerPost from "../models/SeekerPost";
import Waiting from "../models/Waiting";
import Reviewed from "../models/Reviewed";
import Scheduled from "../models/Scheduled";
import Rejected from "../models/Rejected";
import Offering from "../models/Offering";


export const getAllSeekerPost = async (req: Request, res: Response) => {
    try {
      let seekerpostQuery = req.query
      
      if(Object.keys(seekerpostQuery).length !== 0){
        const seekerpost = await SeekerPost.findAll({attributes:{exclude:["createdAt","updatedAt"]}, include:[
          {model:Waiting,attributes:{exclude:["createdAt","updatedAt"]}},
          {model:Reviewed,attributes:{exclude:["createdAt","updatedAt"]}},
          {model:Scheduled,attributes:{exclude:["createdAt","updatedAt"]}},
          {model:Rejected,attributes:{exclude:["createdAt","updatedAt"]}},
          {model:Offering,attributes:{exclude:["createdAt","updatedAt"]}},
        ], where: {
          PostId: seekerpostQuery.postid
        }});
        return response(200, "success call posts by query", seekerpost, res);
      }

      const seekerpost = await SeekerPost.findAll({attributes:{exclude:["createdAt","updatedAt"]}, include:[
        {model:Waiting,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Reviewed,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Scheduled,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Rejected,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Offering,attributes:{exclude:["createdAt","updatedAt"]}},
      ]});
      return response(200, "success call all posts", seekerpost, res);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      res.status(500).json({ error: "Server error" });
    }
};

export const getSeekerPostById = async (req: Request, res: Response) => {
    try {
      const seekerpost = await SeekerPost.findOne({where:{id:req.params.id},attributes:{exclude:["createdAt","updatedAt"]}, include:[
        {model:Waiting,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Reviewed,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Scheduled,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Rejected,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Offering,attributes:{exclude:["createdAt","updatedAt"]}},
      ]});
      return response(200, "success call posts", seekerpost, res);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      res.status(500).json({ error: "Server error" });
    }
};

export const updateSeekerPost = async (req: Request, res: Response) => {
  let seekerpostId = req.params.id
  let seekerpostData = req.body

  try {
    const seekerpost = await SeekerPost.findByPk(seekerpostId);
    console.log(seekerpost);
    
    if (seekerpost) {
      await seekerpost.update(seekerpostData);

      if(req.body.applicantStatus == "Waiting"){
        await Waiting.create({
          waitingDate: getFormattedToday()
        }).then(function(waiting){
          seekerpost.setWaiting(waiting)
        })
      }

      if(req.body.applicantStatus == "Reviewed"){
        await Reviewed.create({
          reviewedDate: getFormattedToday()
        }).then(function(reviewed){
          seekerpost.setReviewed(reviewed)
        })
      }

      if(req.body.applicantStatus == "Scheduled"){
        await Scheduled.create({
          scheduledDate: getFormattedToday()
        }).then(function(result){
          seekerpost.setScheduled(result)
        })
      }

      if(req.body.applicantStatus == "Rejected"){
        await Rejected.create({
          rejectedDate: getFormattedToday(),
          rejectedMessage: seekerpostData.rejectedMessage
        }).then(function(rejected){
          seekerpost.setRejected(rejected)
        })
      }

      if(req.body.applicantStatus == "Offering"){
        await Offering.create({
          offeringDate: getFormattedToday()
        }).then(function(reviewed){
          seekerpost.setOffering(reviewed)
        })
      }


      response(200, "Success update pengguna", seekerpost, res)
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateInterview = async (req: Request, res: Response) => {
  let interviewId = req.params.id
  let interviewData = req.body

  try {
    const scheduled = await Scheduled.findByPk(interviewId);
    if (scheduled) {
      interviewData.interviewDate = `${formatDate(interviewData.interviewDate[0])} • ${interviewData.interviewDate[1]} - ${interviewData.interviewDate[2]}`
      await scheduled.update(interviewData);
      response(200, "Success update pengguna", scheduled, res)
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateOffering = async (req: Request, res: Response) => {
  let offeringId = req.params.id
  let offeringData = req.body

  try {
    const offering = await Offering.findByPk(offeringId);
    if (offering) {
      await offering.update(offeringData);
      response(200, "Success update pengguna", offering, res)
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};




function getFormattedToday(): string {
  const today: Date = new Date();

  const year: number = today.getFullYear();
  let month: number | string = today.getMonth() + 1;
  let day: number | string = today.getDate();

  // Padding digit bulan dan tanggal dengan '0' jika diperlukan
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  // Menggabungkan tahun, bulan, dan tanggal dengan format yang diinginkan
  const formattedToday: string = `${year}-${month}-${day}`;

  return formattedToday;
}

function formatDate(inputDate) {
  // Parse tanggal dalam format "YYYY-MM-DD"
  const dateParts = inputDate.split('-');
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  // Daftar nama bulan
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  // Konversi komponen bulan ke nama bulan
  const formattedMonth = monthNames[parseInt(month, 10) - 1];
  // Gabungkan komponen-komponen dalam format yang diinginkan
  const formattedDate = `${day} ${formattedMonth} ${year}`;

  return formattedDate;
}