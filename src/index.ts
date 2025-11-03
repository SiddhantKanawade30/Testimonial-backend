import  express  from "express"
import type { Request, Response, NextFunction } from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import userRouter from "./routes/user.js"
import campaignRouter from "./routes/campaign.js"
import testimonialRouter from "./routes/testimonial.js"

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors());



app.use("/api/v1/auth", userRouter)
app.use("/api/v1/campaigns", campaignRouter)
app.use("/api/v1/testimonials", testimonialRouter)
app.get("/", (req,res)=>{
   res.json({
      "signup" : "/api/v1/auth/signup",
      "signin" : "/api/v1/auth/signin",
      "googleLogin" : "/api/v1/auth/google",
      "getCampaigns" : "/api/v1/campaigns/get",
      "getCampaignsById" : "/api/v1/campaigns/get/:campaignId",
      "deleteCampaign" : "/api/v1/campaigns/delete",
      "editCampaign" : "/api/v1/campaigns/edit",
      "createCampaign" : "/api/v1/campaigns/create",
      "getTestimonials" : "/api/v1/testimonials/get",
      "getTestimonialsById" : "/api/v1/testimonials/get/:testimonialId",
      "deleteTestimonial" : "/api/v1/testimonials/delete",
      "editTestimonial" : "/api/v1/testimonials/edit",
      
   })
})


app.listen(PORT, () => console.log(`backend server running on port: ${PORT}`))