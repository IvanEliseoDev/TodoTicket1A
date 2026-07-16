import { model, Schema } from "mongoose";

export const adminSchema = new Schema({
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

export const adminModel = model("Admin", adminSchema)