import fetch from "node-fetch"
import { config } from "../config/config.js"

export const wompiController = {
    
    generateToken: async(req, res) => {
        try {
            const response = await fetch("https://id.wompi.sv/connect/token",
            {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, 
            body: new URLSearchParams({grant_type: config.wompi.grant_type,
                audience: config.wompi.audience,
                client_id: config.wompi.client_id,
                client_secret: config.wompi.client_secret})})
            if(!response.ok){
                const error = await response.text()
                return res.status(400).json({status: 400, message:"Error generate token", data: error})
            }
            const data = await response.json()
            return res.status(200).json({status: 200, message:" generate token has successfully", data: data})
        } catch (error) {
            console.log(error)
            return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
        }
    },

    paymetTest: async(req, res) => {
        try {
            const {token, formData} = req.body
            const response = await fetch("https://api.wompi.sv/TransaccionCompra/TokenizadaSin3Ds",
            {method: "POST", headers: {"Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }, 
            body: JSON.stringify(formData)} )
        
            if(!response.ok){
                const error = await response.text()
                return res.status(400).json({status: 400, message:"Error transaccion token", data: error})
            }
            const data = await response.json()
            return res.status(200).json({status: 200, message:" generate token has successfully", data: data})
        } catch (error) {
            console.log(error)
            return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
        }
    }
}