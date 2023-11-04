import express, {Response, Request} from "express";
import { validateTokenWebsite } from "../config/JWT";

const router = express.Router();

router.get("/",validateTokenWebsite, (req: Request, res: Response) => {
  res.render("SeekerProfilePage", {id: req.user.id});
});
router.get("/internships",validateTokenWebsite, (req, res) => {
  res.render("SeekerInternshipPage");
});
router.get("/recruiter-post",validateTokenWebsite, (req, res) => {
  res.render("RecruiterPost");
});

// AUTH
router.get("/login", (req, res) => {
  res.render("LoginRegisterPage");
});

export default router;
