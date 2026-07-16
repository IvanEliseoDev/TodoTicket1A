import express from "express"
import { AdminController } from "../controllers/adminController.js"
import { authAdminController } from "../controllers/authAdmin.js"

export const adminRouter = express.Router()

adminRouter.route("/").get(AdminController.getAllAdmins)
adminRouter.route("/register").post(AdminController.registerAdmin)
adminRouter.route("/login").post(authAdminController.loginAdmin)
adminRouter.route("/logOut").get(authAdminController.logOut)
adminRouter.route("/verifyCode").post(authAdminController.verifyCode)
