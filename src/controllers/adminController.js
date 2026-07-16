import bcryt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import nodemailer from "nodemailer"
import { adminModel } from "../models/adminModel.js"


export const AdminController = {

    getAllAdmins: async(req, res) => {
        try {
            const clients = await adminModel.find()
            if(!clients) return res.status(404).json({status:404, message:"Admins has not found", data: null})
            return res.status(200).json({status:200, message:"Admins has found", data: clients})
        } catch (error) {
            console.log(error)
            return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
        }
    },

    registerAdmin: async(req, res) => {
        try {
            const admiReq = req.body
            const adminEmail = admiReq
            if(!admiReq) return res.status(400).json({status:400, message:"Bad Request - Admin is not null", data: null})
            const existAdmin = await adminModel.findOne({email: adminEmail})
            if(existAdmin) return res.status(400).json({status:400, message:"Bad Request - Admin is alredy exist", data: null})
            const genericPassword =  "9102eu7"
            const passwordHashed = await bcryt.hash(genericPassword, 10)
            const verificationCode = crypto.randomBytes(3).toString("hex")
            const tokenCode = jwt.sign(
                {adminEmail, verificationCode},
                config.jwt.secret,
                {expiresIn: "15m"}
            )
            res.cookie("VerificationToken", tokenCode, {maxAge: 15 * 60 * 1000})
            const transporter = nodemailer.createTransport(
                {
                    service: "gmail",
                    auth: {
                        user: config.user.email,
                        pass: config.user.password
                    },
                    tls:{
                        rejectUnauthorized: false
                    }
                }
            )
            const mailOpt = {
                from: config.user.email,
                to: adminEmail,
                subject: "Verification Code: " + verificationCode
            }
            await transporter.sendMail(mailOpt)
            const newAdmin = new adminModel()
            newAdmin.password = passwordHashed
            newAdmin.isVerified = false
            const adminSaved = await newAdmin.save()
            return res.status(201).json({status: 201, message:"Admin Register has successfully", data: adminSaved})
        } catch (error) {
            console.log(error)
            return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
        }
    }
} 