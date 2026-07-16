import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { config } from "../config/config.js";
import { adminModel } from "../models/adminModel.js";

export const authAdminController = {
  verifyCode: async (req, res) => {
    try {
      const { verificationCodeReq } = req.body;
      const token = req.cookies.verificationToken;
      const decoded = jwt.verify(token, config.jwt.secret);
      console.log({ decoded });
      const adminDecoded = decoded;
      console.log({ adminDecoded });
      if (verificationCodeReq !== adminDecoded.code) {
        return res
          .status(400)
          .json({ status: 400, message: "this code is not same", data: null });
      }
      const newAdmin = new adminModel();
      newAdmin.isVerified = true;
      const admintSaved = await newAdmin.save();
      res.clearCookie("verificationToken");
      res
        .status(200)
        .json({
          status: 200,
          message: "Verify code is same",
          data: admintSaved,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
    }
  },

  loginAdmin: async(req, res) => {
    try {
      const {email, password} = req.boy
      const admin = await adminModel.findOne({email})
      if(!admin) return res.status(404).json({status:404, message:"Admin not exist in system", data: null})
      if(admin.timeOut && admin.timeOut > Date.now()) return res.status(401).json({status: 401, message:"Access not pass", data: null}) 
      const isMatch = await bcrypt.compare(password, admin.password)
      if(!isMatch) {
        if(admin.loginAttempts >= 5) {
          admin.timeOut = Date.now() + 10 *60 * 1000
          admin.loginAttempts = 0
        }
        await admin.save()
        return res.status(401).json({status: 401, message:"Password is not correct", data: null})
      }
      admin.loginAttempts = 0 
      admin.timeOut = undefined
      const adminSaved = await admin.save()
      const token = jwt.sign(
        {email: admin.email, userType: "ADMIN"},
        config.jwt.secret,
        {expiresIn: "30d"}
      )
      res.cookie("authCookie", token, {maxAge: 15 * 60 * 1000})
      return res.status(200).json({status:200, message:"login has successfully", data: adminSaved})
    } catch (error) {
      console.log(error)
      return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
    }
  },

  logOut: async(req, res) => {
    try {
      const {authCookie} = req.cookies
      if(!authCookie) return  res.status(404).json({status:404, message: "Cookie has not found", data: null})
      res.clearCookie("authCookie")
      return res.status(200).json({status:200, message: "LogOut hass succcessfully", data: null})
    } catch (error) {
      console.log(error)
      return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
    }
  }
};
