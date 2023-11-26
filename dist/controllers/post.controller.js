"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePosts = exports.getPostById = exports.getAllPost = void 0;
const Seeker_1 = __importDefault(require("../models/Seeker"));
const response_1 = __importDefault(require("./response"));
const Recruiter_1 = __importDefault(require("../models/Recruiter"));
const Post_1 = __importDefault(require("../models/Post"));
const sequelize_1 = require("sequelize");
const getAllPost = async (req, res) => {
    try {
        let postQuery = req.query;
        if (Object.keys(postQuery).length !== 0) {
            const post = await Post_1.default.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                    { model: Recruiter_1.default, as: "recruiter", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] }, through: { attributes: [] } },
                    { model: Seeker_1.default, as: "applicants", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
                    { model: Seeker_1.default, as: "saved", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
                ], where: {
                    post_position: {
                        [sequelize_1.Op.like]: `%${postQuery.title}%`
                    },
                } });
            return (0, response_1.default)(200, "success call posts by query", post, res);
        }
        const post = await Post_1.default.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                { model: Recruiter_1.default, as: "recruiter", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] }, through: { attributes: [] } },
                { model: Seeker_1.default, as: "applicants", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
                { model: Seeker_1.default, as: "saved", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
            ] });
        return (0, response_1.default)(200, "success call all posts", post, res);
    }
    catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getAllPost = getAllPost;
const getPostById = async (req, res) => {
    try {
        const post = await Post_1.default.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                { model: Recruiter_1.default, as: "recruiter", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] }, through: { attributes: [] } },
                { model: Seeker_1.default, as: "applicants", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
                { model: Seeker_1.default, as: "saved", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
            ] });
        return (0, response_1.default)(200, "success call all posts", post, res);
    }
    catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getPostById = getPostById;
const updatePosts = async (req, res) => {
    const postId = req.params.id;
    const updatedPost = req.body; // Data pembaruan pengguna dari permintaan PUT  
    try {
        const post = await Post_1.default.findByPk(postId);
        if (post) {
            await post.update(updatedPost);
            (0, response_1.default)(200, "Success update pengguna", post, res);
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
exports.updatePosts = updatePosts;
//# sourceMappingURL=post.controller.js.map