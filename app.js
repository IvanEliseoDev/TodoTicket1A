import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import { clientRouter } from "./src/routes/clientRouter.js"
import { adminRouter } from "./src/routes/adminRouter.js"
import { wompiRouter } from "./src/routes/wompiRouter.js"
import { saleTicketRouter } from "./src/routes/saleTicketRouter.js"

export const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use("/api/client", clientRouter)
app.use("/api/admin", adminRouter)
app.use("/api/wompi", wompiRouter)
app.use("/api/sale/ticekt", saleTicketRouter)
