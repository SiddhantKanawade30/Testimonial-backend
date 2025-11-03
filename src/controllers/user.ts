import type { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const getCurrentUser = async (req: Request, res: Response) => {
    //@ts-ignore
    const { userId } = req.userId;
    try{
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        const campaigns = await prisma.campaign.findMany({
            where: {
                userId: userId
            }
        })

        const campaignIds = campaigns.map((campaign) => campaign.id);

        const testimonials = await prisma.testimonial.findMany({
            where: {
                campaignId: {
                    in: campaignIds
                }
            }
        })

        const userData = {
            ...user,
            campaigns,
            testimonials
        }

        res.status(200).json({ userData })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
    
    
}