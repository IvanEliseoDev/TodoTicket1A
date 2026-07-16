import { model, Schema } from "mongoose";

const clientSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default: false
    },
    loginAttempts:{
        type:Number,
        default: 0
    },
    timeOut:{
        type:String
    },
})

export const clientModel = model("Client", clientSchema)