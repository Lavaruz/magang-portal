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

const validateToken = (req: Request, res:Response, next:NextFunction) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    return res.redirect('/login')
  }
  try {
    const validToken = verify(accessToken, "SECRET");
    req.user = validToken;
    if (validToken) {
      req.authenticate = true;
      next();
    }
  } catch (error) {
    return response(500, "server error", { error: error.message }, res);
  }
};

export {
    createToken,
    validateToken
}
