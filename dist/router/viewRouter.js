"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../config/JWT");
const router = express_1.default.Router();
router.get("/", JWT_1.validateTokenWebsite, (req, res) => {
    res.render("SeekerProfilePage", { id: req.user.id });
});
router.get("/internships", JWT_1.validateTokenWebsite, (req, res) => {
    res.render("SeekerInternshipPage");
});
router.get("/recruiter-post", JWT_1.validateTokenWebsite, (req, res) => {
    res.render("RecruiterPost");
});
// AUTH
router.get("/login", (req, res) => {
    res.render("LoginRegisterPage");
});
exports.default = router;
//# sourceMappingURL=viewRouter.js.map