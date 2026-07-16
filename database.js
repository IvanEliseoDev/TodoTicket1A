import mongoose from "mongoose";
import { config } from "./src/config/config";

mongoose.connect(config.db.DB_URI)
const connection = mongoose.connection
connection.once("open", () => {
    console.log("DB Is running in port 4000")
})
connection.on("disconnected", () => {
    console.log("DB is disconnected")
})