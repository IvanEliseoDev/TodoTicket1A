import jwt from "jsonwebtoken"
import { config } from "../config/config.js";

export const validateAuthCookieMdd = (allowedTypes = []) => {
  return(req, res, next) => {
    try {
        const {authCookie} = req.cookies
        if(!authCookie) return res.status(404).json({status:404, message: "Cookie has not found", data: null})
        const decoded = jwt.verify(authCookie, config.jwt.secret)
        if(!allowedTypes.includes(decoded.userType)) return res.status(401).json({status: 401, message: "Access no pass", data: null})
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
    }
  }
};
