import express, {Response, Request} from "express";
import { validateTokenWebsite } from "../config/JWT";

const router = express.Router();

router.get("/",validateTokenWebsite, (req: Request, res: Response) => {
  res.render("SeekerProfilePage", {id: req.user.id, role:req.user.role});
});
router.get("/posts/:id",validateTokenWebsite, (req: Request, res: Response) => {
  res.render("SeekerPostPage", {id: req.user.id, role:req.user.role});
});
router.get("/posts/:id/recruiter",validateTokenWebsite, (req: Request, res: Response) => {
  res.render("RecruiterPostPage", {id: req.user.id, role:req.user.role});
});
router.get("/recruiter/profile",validateTokenWebsite, (req: Request, res: Response) => {
  res.render("RecruiterProfilePage", {id: req.user.id, role:req.user.role});
});
router.get("/internships",validateTokenWebsite, (req:Request, res:Response) => {
  res.render("SeekerInternshipPage-ForYou", {id: req.user.id, role:req.user.role});
});
router.get("/internships/explore",validateTokenWebsite, (req:Request, res:Response) => {
  res.render("SeekerInternshipPage-Explore", {id: req.user.id, role:req.user.role});
});
router.get("/internships/saved",validateTokenWebsite, (req:Request, res:Response) => {
  res.render("SeekerInternshipPage-Saved", {id: req.user.id, role:req.user.role});
});
router.get("/internships/applied",validateTokenWebsite, (req:Request, res:Response) => {
  res.render("SeekerInternshipPage-Applied", {id: req.user.id, role:req.user.role});
});
router.get("/recruiter/post",validateTokenWebsite, (req: Request, res: Response) => {
  res.render("RecruiterPost-All", {id: req.user.id, role:req.user.role});
});
router.get("/recruiter/post/in-progress",validateTokenWebsite, (req: Request, res: Response) => {
  res.render("RecruiterPost-InProgress", {id: req.user.id, role:req.user.role});
});
router.get("/recruiter/post/closed",validateTokenWebsite, (req: Request, res: Response) => {
  res.render("RecruiterPost-Closed", {id: req.user.id, role:req.user.role});
});

// AUTH
router.get("/login", (req, res) => {
  res.render("LoginRegisterPage");
});

export default router;
