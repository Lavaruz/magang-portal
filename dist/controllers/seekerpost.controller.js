"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOffering = exports.updateInterview = exports.updateSeekerPost = exports.getSeekerPostById = exports.getAllSeekerPost = void 0;
const response_1 = __importDefault(require("./response"));
const SeekerPost_1 = __importDefault(require("../models/SeekerPost"));
const Waiting_1 = __importDefault(require("../models/Waiting"));
const Reviewed_1 = __importDefault(require("../models/Reviewed"));
const Scheduled_1 = __importDefault(require("../models/Scheduled"));
const Rejected_1 = __importDefault(require("../models/Rejected"));
const Offering_1 = __importDefault(require("../models/Offering"));
const getAllSeekerPost = async (req, res) => {
    try {
        let seekerpostQuery = req.query;
        if (Object.keys(seekerpostQuery).length !== 0) {
            const seekerpost = await SeekerPost_1.default.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                    { model: Waiting_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
                    { model: Reviewed_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
                    { model: Scheduled_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
                    { model: Rejected_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
                    { model: Offering_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
                ], where: {
                    PostId: seekerpostQuery.postid
                } });
            return (0, response_1.default)(200, "success call posts by query", seekerpost, res);
        }
        const seekerpost = await SeekerPost_1.default.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                { model: Waiting_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Reviewed_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Scheduled_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Rejected_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Offering_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
            ] });
        return (0, response_1.default)(200, "success call all posts", seekerpost, res);
    }
    catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getAllSeekerPost = getAllSeekerPost;
const getSeekerPostById = async (req, res) => {
    try {
        const seekerpost = await SeekerPost_1.default.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                { model: Waiting_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Reviewed_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Scheduled_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Rejected_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Offering_1.default, attributes: { exclude: ["createdAt", "updatedAt"] } },
            ] });
        return (0, response_1.default)(200, "success call posts", seekerpost, res);
    }
    catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getSeekerPostById = getSeekerPostById;
const updateSeekerPost = async (req, res) => {
    let seekerpostId = req.params.id;
    let seekerpostData = req.body;
    try {
        const seekerpost = await SeekerPost_1.default.findByPk(seekerpostId);
        if (seekerpost) {
            await seekerpost.update(seekerpostData);
            if (req.body.applicantStatus == "Waiting") {
                await Waiting_1.default.create({
                    waitingDate: getFormattedToday()
                }).then(function (waiting) {
                    seekerpost.setWaiting(waiting);
                });
            }
            if (req.body.applicantStatus == "Reviewed") {
                await Reviewed_1.default.create({
                    reviewedDate: getFormattedToday()
                }).then(function (reviewed) {
                    seekerpost.setReviewed(reviewed);
                });
            }
            if (req.body.applicantStatus == "Scheduled") {
                await Scheduled_1.default.create({
                    scheduledDate: getFormattedToday()
                }).then(function (result) {
                    seekerpost.setScheduled(result);
                });
            }
            if (req.body.applicantStatus == "Rejected") {
                await Rejected_1.default.create({
                    rejectedDate: getFormattedToday(),
                    rejectedMessage: seekerpostData.rejectedMessage
                }).then(function (rejected) {
                    seekerpost.setRejected(rejected);
                });
            }
            if (req.body.applicantStatus == "Offering") {
                await Offering_1.default.create({
                    offeringDate: getFormattedToday()
                }).then(function (reviewed) {
                    seekerpost.setOffering(reviewed);
                });
            }
            (0, response_1.default)(200, "Success update pengguna", seekerpost, res);
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
exports.updateSeekerPost = updateSeekerPost;
const updateInterview = async (req, res) => {
    let interviewId = req.params.id;
    let interviewData = req.body;
    try {
        const scheduled = await Scheduled_1.default.findByPk(interviewId);
        if (scheduled) {
            interviewData.interviewDate = `${formatDate(interviewData.interviewDate[0])} • ${interviewData.interviewDate[1]} - ${interviewData.interviewDate[2]}`;
            await scheduled.update(interviewData);
            (0, response_1.default)(200, "Success update pengguna", scheduled, res);
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
exports.updateInterview = updateInterview;
const updateOffering = async (req, res) => {
    let offeringId = req.params.id;
    let offeringData = req.body;
    try {
        const offering = await Offering_1.default.findByPk(offeringId);
        if (offering) {
            await offering.update(offeringData);
            (0, response_1.default)(200, "Success update pengguna", offering, res);
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
exports.updateOffering = updateOffering;
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
//# sourceMappingURL=seekerpost.controller.js.map