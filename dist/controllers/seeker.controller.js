"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addApplied = exports.addSavedPost = exports.addRecruiter = exports.deleteAttachment = exports.setAttachment = exports.updateEducation = exports.deleteEducation = exports.addEducation = exports.updateExperience = exports.deleteExperience = exports.addExperience = exports.deleteSeeker = exports.updateSeeker = exports.loginSeeker = exports.createSeeker = exports.getSeekerById = exports.getAllSeeker = void 0;
const Seeker_1 = __importDefault(require("../models/Seeker"));
const Experience_1 = __importDefault(require("../models/Experience"));
const Education_1 = __importDefault(require("../models/Education"));
const response_1 = __importDefault(require("./response"));
const bcrypt = __importStar(require("bcrypt"));
const JWT_1 = require("../config/JWT");
const Attachment_1 = __importDefault(require("../models/Attachment"));
const fs_1 = __importDefault(require("fs"));
const Recruiter_1 = __importDefault(require("../models/Recruiter"));
const Post_1 = __importDefault(require("../models/Post"));
// Fungsi ini mengambil semua pengguna
const getAllSeeker = async (req, res) => {
    try {
        const seeker = await Seeker_1.default.findAll({ attributes: { exclude: ["createdAt", "updatedAt", "password"] }, include: [
                { model: Experience_1.default, as: "experiences", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Education_1.default, as: "educations", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Attachment_1.default, as: "attachment", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Recruiter_1.default, as: "recruiter", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Post_1.default, as: "applied", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Post_1.default, as: "saved", attributes: { exclude: ["createdAt", "updatedAt"] } },
            ] });
        (0, response_1.default)(200, "success call all seeker", seeker, res);
    }
    catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getAllSeeker = getAllSeeker;
// Fungsi ini mengambil satu pengguna berdasarkan ID
const getSeekerById = async (req, res) => {
    const seekerId = req.params.id;
    try {
        const mahasiswa = await Seeker_1.default.findByPk(seekerId, { attributes: { exclude: ["createdAt", "updatedAt", "password"] }, include: [
                { model: Experience_1.default, as: "experiences", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Education_1.default, as: "educations", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Attachment_1.default, as: "attachment", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Recruiter_1.default, as: "recruiter", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Post_1.default, as: "applied", attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                        { model: Recruiter_1.default, as: "recruiter", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] }, through: { attributes: [] } },
                    ] },
                { model: Post_1.default, as: "saved", attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                        { model: Recruiter_1.default, as: "recruiter", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] }, through: { attributes: [] } },
                        { model: Seeker_1.default, as: "applicants", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
                        { model: Seeker_1.default, as: "saved", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
                    ] },
            ] });
        if (mahasiswa) {
            res.status(200).json(mahasiswa);
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
exports.getSeekerById = getSeekerById;
// Fungsi ini membuat pengguna baru
const createSeeker = async (req, res) => {
    const seekerData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
    seekerData.role = "seeker";
    try {
        hashPassword(seekerData.password)
            .then(async (hashedPassword) => {
            seekerData.password = hashedPassword;
            let newSeeker = await Seeker_1.default.create(seekerData);
            // Membut cookies untuk login
            const accessToken = (0, JWT_1.createToken)(newSeeker);
            res.cookie("access-token", accessToken, {
                maxAge: 3600000,
            });
            (0, response_1.default)(201, "success create new users", newSeeker, res);
        })
            .catch((error) => {
            console.error("Gagal membuat pengguna:", error);
            res.status(500).json({ error: "Server error" });
        });
    }
    catch (error) {
        console.error("Gagal membuat pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.createSeeker = createSeeker;
const loginSeeker = async (req, res) => {
    const seekerData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
    try {
        let seeker = await Seeker_1.default.findOne({
            where: {
                email: seekerData.email
            }
        });
        if (!seeker)
            return (0, response_1.default)(400, "seeker not found", [], res);
        bcrypt.compare(seekerData.password, seeker.password).then((match) => {
            if (!match) {
                return res.json({ error: "wrong username and password combination" });
            }
            else {
                const accessToken = (0, JWT_1.createToken)(seeker);
                res.cookie("access-token", accessToken, {
                    maxAge: 360000000,
                });
                return (0, response_1.default)(200, "success login", seeker, res);
            }
        });
    }
    catch (error) {
        console.error("Gagal login pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.loginSeeker = loginSeeker;
// Fungsi ini memperbarui pengguna berdasarkan ID
const updateSeeker = async (req, res) => {
    const seekerId = req.params.id;
    const updatedSeeker = req.body; // Data pembaruan pengguna dari permintaan PUT  
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            // Menambahakan URL Image ke dalam gambar, 
            // dan menghapus gambar lama ketika upload gambar baru
            if (req.files.length !== 0) {
                if (seeker.profile_picture) {
                    const fileToDelete = `public/files/uploads/${seeker.profile_picture.split("uploads/")[1]}`;
                    if (fs_1.default.existsSync(fileToDelete)) {
                        try {
                            fs_1.default.unlinkSync(fileToDelete);
                            console.log(`File ${seeker.profile_picture.split("uploads/")[1]} deleted successfully.`);
                        }
                        catch (err) {
                            console.error(`Error deleting file ${seeker.profile_picture.split("uploads/")[1]}: ${err}`);
                        }
                    }
                    else {
                        console.log(`File ${seeker.profile_picture.split("uploads/")[1]} not found.`);
                    }
                }
                req.body.profile_picture = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
            }
            await seeker.update(updatedSeeker);
            (0, response_1.default)(200, "Success update pengguna", seeker, res);
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
exports.updateSeeker = updateSeeker;
// Fungsi ini menghapus pengguna berdasarkan ID
const deleteSeeker = async (req, res) => {
    const seekerId = req.params.id;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            await seeker.destroy();
            res.status(204).end(); // Mengembalikan 204 No Content jika pengguna berhasil dihapus
        }
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal menghapus pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.deleteSeeker = deleteSeeker;
const hashPassword = async (plainPassword) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        return hashedPassword;
    }
    catch (error) {
        throw new Error('Error hashing password');
    }
};
// EXPERIENCES
// Fungsi ini membuat experience pengguna berdasarkan ID
const addExperience = async (req, res) => {
    const seekerId = req.params.id;
    const experienceData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            await Experience_1.default.create(experienceData).then(async function (result) {
                await seeker.addExperience(result);
                (0, response_1.default)(200, "Success update pengguna", seeker, res);
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
exports.addExperience = addExperience;
const deleteExperience = async (req, res) => {
    const seekerId = req.params.id;
    const deletionId = req.params.deletionId;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
            const experience = await seeker.getExperiences({ where: { id: deletionId } });
            if (experience.length > 0) {
                // Jika pengalaman ditemukan, hapus pengalaman tersebut
                seeker.removeExperience(experience);
                await Experience_1.default.destroy({ where: { id: deletionId } });
                (0, response_1.default)(200, "Pengalaman berhasil dihapus", seeker, res);
            }
            else {
                res.status(404).json({ error: "Experience tidak ditemukan" });
            }
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
exports.deleteExperience = deleteExperience;
const updateExperience = async (req, res) => {
    const seekerId = req.params.id;
    const updateId = req.params.updateId;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
            const experience = await seeker.getExperiences({ where: { id: updateId } });
            if (experience.length > 0) {
                if (req.body.exp_enddate == null)
                    req.body.exp_enddate = null;
                await Experience_1.default.update(req.body, { where: { id: updateId } });
                (0, response_1.default)(200, "Education berhasil diupdate", seeker, res);
            }
            else {
                res.status(404).json({ error: "Education tidak ditemukan" });
            }
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
exports.updateExperience = updateExperience;
// EDUCATION
// Fungsi ini membuat education pengguna berdasarkan ID
const addEducation = async (req, res) => {
    const seekerId = req.params.id;
    const educationData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            await Education_1.default.create(educationData).then(async function (result) {
                await seeker.addEducation(result);
                (0, response_1.default)(200, "Success update pengguna", seeker, res);
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
exports.addEducation = addEducation;
const deleteEducation = async (req, res) => {
    const seekerId = req.params.id;
    const deletionId = req.params.deletionId;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
            const education = await seeker.getEducations({ where: { id: deletionId } });
            if (education.length > 0) {
                // Jika pengalaman ditemukan, hapus pengalaman tersebut
                seeker.removeEducation(education);
                await Education_1.default.destroy({ where: { id: deletionId } });
                (0, response_1.default)(200, "Education berhasil dihapus", seeker, res);
            }
            else {
                res.status(404).json({ error: "Education tidak ditemukan" });
            }
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
exports.deleteEducation = deleteEducation;
const updateEducation = async (req, res) => {
    const seekerId = req.params.id;
    const updateId = req.params.updateId;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
            const education = await seeker.getEducations({ where: { id: updateId } });
            if (education.length > 0) {
                await Education_1.default.update(req.body, { where: { id: updateId } });
                (0, response_1.default)(200, "Education berhasil diupdate", seeker, res);
            }
            else {
                res.status(404).json({ error: "Education tidak ditemukan" });
            }
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
exports.updateEducation = updateEducation;
// ATTACHMENT
const setAttachment = async (req, res) => {
    const seekerId = req.params.id;
    const attachmentData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            // if user upload file resume
            let attachment = (await seeker.getAttachment());
            attachmentData.atc_resume = attachment ? attachment.atc_resume : null;
            if (req.files.length !== 0) {
                if (attachment) {
                    if (attachment.atc_resume) {
                        const filename = attachment.atc_resume.split("/uploads")[1];
                        const fileToDelete = `public/files/uploads/${filename}`;
                        if (fs_1.default.existsSync(fileToDelete)) {
                            try {
                                fs_1.default.unlinkSync(fileToDelete);
                                console.log(`File ${filename} deleted successfully.`);
                            }
                            catch (err) {
                                console.error(`Error deleting file ${filename}: ${err}`);
                            }
                        }
                        else {
                            console.log(`File ${filename} not found.`);
                        }
                    }
                }
                attachmentData.atc_resume = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
            }
            // check if attachment not null delete previous data
            let attachmentId = attachment ? attachment.id : null;
            if (attachmentId) {
                await Attachment_1.default.update(attachmentData, { where: { id: attachmentId } });
                (0, response_1.default)(200, "Success update attachment", seeker, res);
            }
            else {
                // create new attachment
                await Attachment_1.default.create(attachmentData).then(async function (result) {
                    await seeker.setAttachment(result);
                    (0, response_1.default)(200, "Success update pengguna", seeker, res);
                });
            }
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
exports.setAttachment = setAttachment;
const deleteAttachment = async (req, res) => {
    const seekerId = req.params.id;
    const fieldName = req.params.fieldName;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
            const attachmentData = (await seeker.getAttachment());
            if (attachmentData) {
                if (attachmentData[fieldName]) {
                    attachmentData[fieldName] = null;
                    await attachmentData.save();
                    (0, response_1.default)(200, `${fieldName} berhasil dihapus`, seeker, res);
                }
                else {
                    res.status(404).json({ error: `${fieldName} tidak ditemukan` });
                }
            }
            else {
                res.status(404).json({ error: "Attachment tidak ditemukan" });
            }
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
exports.deleteAttachment = deleteAttachment;
// Recruiter Register
const addRecruiter = async (req, res) => {
    const seekerId = req.params.id;
    const recruiterData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            await Recruiter_1.default.create(recruiterData).then(async function (result) {
                await seeker.setRecruiter(result);
                seeker.update({ role: "recruiter" });
                (0, response_1.default)(200, "Success update pengguna", seeker, res);
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
exports.addRecruiter = addRecruiter;
const addSavedPost = async (req, res) => {
    const seekerId = req.params.id;
    const recruiterData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        const post = await Post_1.default.findByPk(recruiterData.post_id);
        if (seeker) {
            if (recruiterData.loved == "true") {
                seeker.addSaved(post);
                return (0, response_1.default)(200, "Success update pengguna", [], res);
            }
            else {
                seeker.removeSaved(post);
                return (0, response_1.default)(200, "Success hapus post", [], res);
            }
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
exports.addSavedPost = addSavedPost;
// Seeker Apply Post
const addApplied = async (req, res) => {
    const seekerId = req.params.id;
    const postId = req.params.postId;
    const seekerData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        // const seekerpost = await SeekerPost.findByPk(seekerpostId);
        const seeker = await Seeker_1.default.findByPk(seekerId);
        const post = await Post_1.default.findByPk(postId);
        let attachment = (await seeker.getAttachment());
        seekerData.atc_resume = attachment ? attachment.atc_resume : null;
        if (req.files.length !== 0) {
            if (attachment) {
                if (attachment.atc_resume) {
                    const filename = attachment.atc_resume.split("/uploads")[1];
                    const fileToDelete = `public/files/uploads/${filename}`;
                    if (fs_1.default.existsSync(fileToDelete)) {
                        try {
                            fs_1.default.unlinkSync(fileToDelete);
                            console.log(`File ${filename} deleted successfully.`);
                        }
                        catch (err) {
                            console.error(`Error deleting file ${filename}: ${err}`);
                        }
                    }
                    else {
                        console.log(`File ${filename} not found.`);
                    }
                }
            }
            seekerData.atc_resume = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
        }
        let attachmentId = attachment ? attachment.id : null;
        if (seeker) {
            if (attachmentId) {
                await Attachment_1.default.update(seekerData, { where: { id: attachmentId } });
            }
            else {
                // create new attachment
                await Attachment_1.default.create(seekerData).then(async function (result) {
                    await seeker.setAttachment(result);
                });
            }
            await seeker.addApplied(post);
            // await Waiting.create({
            //   waitingDate: getFormattedToday()
            // }).then(function(waiting){
            //   seekerpost.setWaiting(waiting)
            // })
            return (0, response_1.default)(200, "Success apply", [], res);
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
exports.addApplied = addApplied;
function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    // Padding digit bulan dan tanggal dengan '0' jika diperlukan
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    // Menggabungkan tahun, bulan, dan tanggal dengan format yang diinginkan
    const formattedToday = `${year}-${month}-${day}`;
    return formattedToday;
}
//# sourceMappingURL=seeker.controller.js.map