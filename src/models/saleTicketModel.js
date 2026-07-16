import mongoose, { model, Schema } from "mongoose";

const saleTicketSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    },
    quantity:{
        type: Number
    },
    pucharseDate: {
        type: Date
    },
    total:{
        type: String
    },
    paymentStatus: {
        type: String
    },
    transactionId: {
        type: String
    }
})

export const saleTicketModel = model("Sales", saleTicketSchema)