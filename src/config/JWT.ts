import { sign, verify } from "jsonwebtoken";
import response from "../controllers/response";
import { Request, Response, NextFunction } from "express";

declare module 'express' {
    interface Request {
      user?: any; // Ganti 'any' dengan jenis data yang sesuai untuk 'user'.
      authenticate?: boolean
    }
}

const createToken = (user) => {
  const accessToken = sign(
    {
      id: user.id,
      role: user.role,
    },
    "SECRET"
  );
  return accessToken;
};

const validateTokenWebsite = (req: Request, res:Response, next:NextFunction) => {
  const accessToken = req.cookies["access-token"];
  // if token expired or not login
  if (!accessToken) return res.redirect("/login")
  try {
    verify(accessToken, "SECRET", function(err, user){
      if(err) return res.redirect("/login")
      req.user = user
      next()
    });
  } catch (error) {
    return response(500, "server error", { error: error.message }, res);
  }
};

export {
    createToken,
    validateTokenWebsite
}
