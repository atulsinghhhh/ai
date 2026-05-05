import type { Request, Response, NextFunction } from "express";
import { supabase } from "./client";
import { prisma } from "./db";

export async function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
        console.warn("Missing Authorization header");
        return res.status(403).json({ message: "Unauthorized" });
    }

    const data = await supabase.auth.getUser(token);
    const userId = data.data.user?.id;
    
    if (userId) {
        // console.log({
        //             id: data.data.user?.id!,
        //             email: data.data.user?.email!,
        //             provider:  data.data.user?.app_metadata.provider==="google"?"GOOGLE":"GITHUB",
        //             name: data.data.user?.user_metadata.name,
        //             supabaseId: data.data.user?.id!,
        //         })
        try {
            await prisma.user.upsert({
                where: { id: userId },
                update: {
                    email: data.data.user!.email!,
                    name: data.data.user?.user_metadata.name,
                },
                create: {
                    id: userId,
                    email: data.data.user!.email!,
                    provider: data.data.user?.app_metadata.provider === "google" ? "GOOGLE" : "GITHUB",
                    name: data.data.user?.user_metadata.name,
                    supabaseId: userId,
                },
            });
            console.log("User synced with DB", { userId });
        } catch (error) {
            console.error("Error syncing user with DB:", error instanceof Error ? error.message : error);
        }
        req.userId = userId;
        next();
    } else {
        console.warn("Unauthorized: no user from token", { tokenPresent: Boolean(token) });
        res.status(403).json({ message: "Unauthorized" });
    }
}