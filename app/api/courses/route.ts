import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import {db} from "@/lib/db";

export async function POST(req: Request) {
    try {
        const {userId} = auth()
        const {title} = await req.json()
        if (!userId) return new NextResponse("Unauthenticated", {status: 401})

        const course = await db.course.create({
            data: {
                userId,
                title
            }
        })

        return NextResponse.json(course, {status: 201})
    } catch (error) {
        console.log("[COURSES_POST]", error)
        return new NextResponse("Something went wrong", {status: 500})
    }
}