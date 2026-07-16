import express from "express"
import { AdminController } from "../controllers/adminController"
import { authAdminController } from "../controllers/authAdmin"

export const adminRouter = express.Router()

adminRouter.route("/").get(AdminController.getAllAdmins)
adminRouter.route("/regiser").get(AdminController.registerAdmin)
adminRouter.route("/login").get(authAdminController.loginAdmin)
adminRouter.route("/logOut").get(authAdminController.logOut)
adminRouter.route("/verifyCode").get(authAdminController.verifyCode)
