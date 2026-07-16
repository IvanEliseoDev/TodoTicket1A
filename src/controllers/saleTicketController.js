import { saleTicketModel } from "../models/saleTicketModel.js"


export const saleTicketController = {
    
    getAllSales: async(req, res) => {
        try {
            const sales = await saleTicketModel.find()
             if(!sales) return res.status(404).json({status:404, message:"sales has not found", data: null})
            return res.status(200).json({status:200, message:"sales has found", data: sales})
        } catch (error) {
            console.log(error)
            return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
        }
    },
    insertSale: async(req, res) => {
        try {
            const salesReq = req.body
            if(salesReq.quantity <= 0 ) return res.status(400).json({status: 400, message: "the quantity must not be less than zero", data:null})
            const newSale = new saleTicketModel(salesReq)
            newSale.pucharseDate = Date.now()
            const saleSaved = await newSale.save()
            return res.status(201).json({status:201, message:"sale created hass successfully", data: saleSaved})
        } catch (error) {
            console.log(error)
            return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
        }
    },
    updateSale: async(req, res) => {
        try {
            const salesReq = req.body
            const id = req.params.id
            if(salesReq.quantity <= 0 ) return res.status(400).json({status: 400, message: "the quantity must not be less than zero", data:null})
            const newSale = await saleTicketModel.findByIdAndUpdate(id, {...salesReq}, {new: true})
            return res.status(201).json({status:200, message:"sale updated has successfully", data: newSale})
        } catch (error) {
            console.log(error)
            return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
        }
    },
    deleteSale: async(req, res) => {
        try {
           const id = req.params.id
            if(!id) return res.status(404).json({status:404, message:"Bad request - id is not null", data: null})
            const response = await saleTicketModel.findByIdAndDelete(id)
            return res.status(204).json({status:204, message:"sale deleted hass successfully", data: response})
        } catch (error) {
            console.log(error)
            return res.status(500).json({status:500, message:"Internal Server Error - Check server logs", data: null})
        }
    }
}