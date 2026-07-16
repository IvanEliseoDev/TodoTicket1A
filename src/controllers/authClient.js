import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { clientModel } from "../models/clientModel";

export const authClientController = {
  verifyCode: async (req, res) => {
    try {
      const { verificationCodeReq } = req.body;
      const token = req.cookies.verificationToken;
      const decoded = jwt.verify(token, config.jwt.secret);
      console.log({ decoded });
      const clientDecoded = decoded;
      console.log({ clientDecoded });
      if (verificationCodeReq !== clientDecoded.code) {
        return res
          .status(400)
          .json({ status: 400, message: "this code is not same", data: null });
      }
      const newClient = new clientModel();
      newClient.isVerified = true;
      const clientSaved = await newClient.save();
      res.clearCookie("verificationToken");
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
    
  }
};
