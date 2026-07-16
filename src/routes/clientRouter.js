import express from "express"
import { clientController } from "../controllers/clientsController.js"
import { authClientController } from "../controllers/authClient.js"

export const clientRouter = express.Router()

clientRouter.route("/").get(clientController.getAllClients)
clientRouter.route("/register").post(clientController.registerClient)
clientRouter.route("/login").post(authClientController.loginClient)
clientRouter.route("/logOut").get(authClientController.logOut)
clientRouter.route("/verifyCode").post(authClientController.verifyCode)
