"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPost = exports.addGallery = exports.updateRecruiter = exports.getRecruiterById = exports.getAllRecruiter = void 0;
const Seeker_1 = __importDefault(require("../models/Seeker"));
const response_1 = __importDefault(require("./response"));
const fs_1 = __importDefault(require("fs"));
const Recruiter_1 = __importDefault(require("../models/Recruiter"));
const Gallery_1 = __importDefault(require("../models/Gallery"));
const Post_1 = __importDefault(require("../models/Post"));
const getAllRecruiter = async (req, res) => {
    try {
        const recruiters = await Recruiter_1.default.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                { model: Gallery_1.default, as: "gallery", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Post_1.default, as: "posts", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] }, through: { attributes: [] } }
            ] });
        (0, response_1.default)(200, "success call all recruiter", recruiters, res);
    }
    catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getAllRecruiter = getAllRecruiter;
const getRecruiterById = async (req, res) => {
    const recruiterId = req.params.id;
    try {
        const recruiter = await Recruiter_1.default.findByPk(recruiterId, { attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                { model: Gallery_1.default, as: "gallery", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
                { model: Post_1.default, as: "posts", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] }, include: [
                        { model: Seeker_1.default, as: "applicants", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } }
                    ], through: { attributes: [] } },
            ] });
        if (recruiter) {
            res.status(200).json(recruiter);
        }
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getRecruiterById = getRecruiterById;
const updateRecruiter = async (req, res) => {
    const recruiterId = req.params.id;
    console.log(req.params);
    const updatedRecruiter = req.body; // Data pembaruan pengguna dari permintaan PUT  
    try {
        const recruiter = await Recruiter_1.default.findByPk(recruiterId);
        if (recruiter) {
            // Menambahakan URL Image ke dalam gambar, 
            // dan menghapus gambar lama ketika upload gambar baru
            if (req.files.length !== 0) {
                if (req.files[0].fieldname == "org-banner") {
                    if (recruiter.rec_banner) {
                        const fileToDelete = `public/files/uploads/${recruiter.rec_banner.split("uploads/")[1]}`;
                        if (fs_1.default.existsSync(fileToDelete)) {
                            try {
                                fs_1.default.unlinkSync(fileToDelete);
                                console.log(`File ${recruiter.rec_banner.split("uploads/")[1]} deleted successfully.`);
                            }
                            catch (err) {
                                console.error(`Error deleting file ${recruiter.rec_banner.split("uploads/")[1]}: ${err}`);
                            }
                        }
                        else {
                            console.log(`File ${recruiter.rec_banner.split("uploads/")[1]} not found.`);
                        }
                    }
                    req.body.rec_banner = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
                }
                else if (req.files[0].fieldname == "rec-org-logo") {
                    if (recruiter.rec_org_logo) {
                        const fileToDelete = `public/files/uploads/${recruiter.rec_org_logo.split("uploads/")[1]}`;
                        if (fs_1.default.existsSync(fileToDelete)) {
                            try {
                                fs_1.default.unlinkSync(fileToDelete);
                                console.log(`File ${recruiter.rec_org_logo.split("uploads/")[1]} deleted successfully.`);
                            }
                            catch (err) {
                                console.error(`Error deleting file ${recruiter.rec_org_logo.split("uploads/")[1]}: ${err}`);
                            }
                        }
                        else {
                            console.log(`File ${recruiter.rec_org_logo.split("uploads/")[1]} not found.`);
                        }
                    }
                    req.body.rec_org_logo = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
                }
            }
            await recruiter.update(updatedRecruiter);
            (0, response_1.default)(200, "Success update pengguna", recruiter, res);
        }
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.updateRecruiter = updateRecruiter;
// GALLERY
const addGallery = async (req, res) => {
    const recruiterId = req.params.id;
    const galleryData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const recruiter = await Recruiter_1.default.findByPk(recruiterId);
        if (recruiter) {
            if (req.files.length !== 0) {
                if (req.files[0].fieldname == "rec-gallery") {
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
                    req.body.gal_photo = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
                }
            }
            await Gallery_1.default.create(galleryData).then(async function (result) {
                await recruiter.addGallery(result);
                (0, response_1.default)(200, "Success update pengguna", recruiter, res);
            });
        }
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.addGallery = addGallery;
// POST
const addPost = async (req, res) => {
    let postData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
    const recruiterId = req.params.id;
    try {
        const recruiter = await Recruiter_1.default.findByPk(recruiterId);
        if (postData.post_resume_req)
            postData.post_resume_req = true;
        if (postData.post_portfolio_req)
            postData.post_portfolio_req = true;
        console.log(postData.post_thp);
        if (postData.post_thp_min && !postData.post_thp_max)
            postData.post_thp = `Rp.${postData.post_thp_min}+`;
        if (!postData.post_thp_min && postData.post_thp_max)
            postData.post_thp = `Rp.0-Rp.${postData.post_thp_max}`;
        if (postData.post_thp_min && postData.post_thp_max)
            postData.post_thp = `Rp.${postData.post_thp_min}-Rp.${postData.post_thp_max}`;
        if (recruiter) {
            await Post_1.default.create(postData).then(async function (result) {
                await recruiter.addPost(result);
                (0, response_1.default)(200, "Success update pengguna", recruiter, res);
            });
        }
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal membuat pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.addPost = addPost;
//# sourceMappingURL=recruiter.controller.js.map