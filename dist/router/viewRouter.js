"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../config/JWT");
const router = express_1.default.Router();
router.get("/", JWT_1.validateTokenWebsite, (req, res) => {
    res.render("SeekerProfilePage", { id: req.user.id, role: req.user.role });
});
router.get("/posts/:id", JWT_1.validateTokenWebsite, (req, res) => {
    res.render("SeekerPostPage", { id: req.user.id, role: req.user.role });
});
router.get("/posts/:id/recruiter", JWT_1.validateTokenWebsite, (req, res) => {
    res.render("RecruiterPostPage", { id: req.user.id, role: req.user.role });
});
router.get("/recruiter/profile", JWT_1.validateTokenWebsite, (req, res) => {
    res.render("RecruiterProfilePage", { id: req.user.id, role: req.user.role });
});
router.get("/internships", JWT_1.validateTokenWebsite, (req, res) => {
    res.render("SeekerInternshipPage-ForYou", { id: req.user.id, role: req.user.role });
});
router.get("/internships/explore", JWT_1.validateTokenWebsite, (req, res) => {
    res.render("SeekerInternshipPage-Explore", { id: req.user.id, role: req.user.role });
});
router.get("/internships/saved", JWT_1.validateTokenWebsite, (req, res) => {
    res.render("SeekerInternshipPage-Saved", { id: req.user.id, role: req.user.role });
});
router.get("/internships/applied", JWT_1.validateTokenWebsite, (req, res) => {
    res.render("SeekerInternshipPage-Applied", { id: req.user.id, role: req.user.role });
});
router.get("/recruiter/post", JWT_1.validateTokenWebsite, (req, res) => {
    res.render("RecruiterPost-All", { id: req.user.id, role: req.user.role });
});
router.get("/recruiter/post/in-progress", JWT_1.validateTokenWebsite, (req, res) => {
    res.render("RecruiterPost-InProgress", { id: req.user.id, role: req.user.role });
});
router.get("/recruiter/post/closed", JWT_1.validateTokenWebsite, (req, res) => {
    res.render("RecruiterPost-Closed", { id: req.user.id, role: req.user.role });
});
// AUTH
router.get("/login", (req, res) => {
    res.render("LoginRegisterPage");
});
exports.default = router;
//# sourceMappingURL=viewRouter.js.map