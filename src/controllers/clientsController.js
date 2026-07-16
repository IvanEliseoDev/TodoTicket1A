import { clientModel } from "../models/clientModel"
import bcryt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { config } from "../config/config"
import nodemailer from "nodemailer"


export const clientController = {

    getAllClients: async(req, res) => {
        try {
            const clients = await clientModel.find()
            if(!clients) return res.status(404).json({status:404, message:"Clients has not found", data: null})
            return res.status(200).json({status:200, message:"Clients has found", data: clients})
        } catch (error) {
            console.log(error)
            return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
        }
    },

    registerClient: async(req, res) => {
        try {
            const clientReq = req.body
            const clientEmail = clientReq
            if(!clientReq) return res.status(400).json({status:400, message:"Bad Request - Client is not null", data: null})
            const existClient = await clientModel.findOne({email: clientEmail})
            if(existClient) return res.status(400).json({status:400, message:"Bad Request - Client is alredy exist", data: null})
            const genericPassword =  "9102eu7"
            const passwordHashed = await bcryt.hash(genericPassword, 10)
            const verificationCode = crypto.randomBytes(3).toString("hex")
            const tokenCode = jwt.sign(
                {clientEmail, verificationCode},
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
                to: clientEmail,
                subject: "Verification Code: " + verificationCode
            }
            await transporter.sendMail(mailOpt)
            const newClient = new clientModel()
            newClient.password = passwordHashed
            newClient.isVerified = false
            const clientSaved = await newClient.save()
            return res.status(201).json({status: 201, message:"Client Register has successfully", data: clientSaved})
        } catch (error) {
            console.log(error)
            return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
        }
    }
} 