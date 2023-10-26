import express, {Response, Request} from "express";
import { validateToken } from "../config/JTW";

const router = express.Router();

router.get("/",validateToken, (req: Request, res: Response) => {
  res.render("SeekerProfilePage", {
    id: req.user.id
  });
});
router.get("/internships",validateToken, (req, res) => {
  res.render("SeekerInternshipPage");
});
router.get("/recruiter-post",validateToken, (req, res) => {
  res.render("RecruiterPost");
});

// AUTH
router.get("/login", (req, res) => {
  res.render("LoginRegisterPage");
});

export default router;
