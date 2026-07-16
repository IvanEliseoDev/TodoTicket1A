import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { config } from "../config/config.js";
import { clientModel } from "../models/clientModel.js";

export const authClientController = {
  verifyCode: async (req, res) => {
    try {
      const { verificationCodeReq } = req.body;
      const token = req.cookies.VerificationToken;
      console.log(token)
      const decoded = jwt.verify(token, config.jwt.secret);
      console.log({ decoded });
      const clientDecoded = decoded;
      console.log({ clientDecoded });
      console.log({verificationCodeReq, verificationCode: clientDecoded.verificationCode})
      if (verificationCodeReq !== clientDecoded.verificationCode) {
        return res
          .status(400)
          .json({ status: 400, message: "this code is not same", data: null });
      }
      const newClient = new clientModel();
      newClient.isVerified = true;
      const clientSaved = await newClient.save();
      res.clearCookie("VerificationToken");
      res
        .status(200)
        .json({
          status: 200,
          message: "Verify code is same",
          data: clientSaved,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
    }
  },

  loginClient: async(req, res) => {
    try {
      const {email, password} = req.body
      console.log("emailrecivido", email , "password: ", password)
      const client = await clientModel.findOne({email})
      console.log(client)
      if(!client) return res.status(404).json({status:404, message:"Client not exist in system", data: null})
      if(client.timeOut && client.timeOut > Date.now()) return res.status(401).json({status: 401, message:"Access not pass", data: null}) 
      const isMatch = await bcrypt.compare(password, client.password)
      if(!isMatch) {
        if(client.loginAttempts >= 5) {
          client.timeOut = Date.now() + 10 *60 * 1000
          client.loginAttempts = 0
        }
        await client.save()
        return res.status(401).json({status: 401, message:"Password is not correct", data: null})
      }
      client.loginAttempts = 0 
      client.timeOut = undefined
      const clientSaved = await client.save()
      const token = jwt.sign(
        {email: client.email, userType: "CLIENTE"},
        config.jwt.secret,
        {expiresIn: "30d"}
      )
      res.cookie("authCookie", token, {maxAge: 15 * 60 * 1000})
      return res.status(200).json({status:200, message:"login has successfully", data: clientSaved})
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
