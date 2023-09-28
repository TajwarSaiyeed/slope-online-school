import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import {db} from "@/lib/db";

export async function PATCH(req: Request, {params}: {
    params: {
        courseId: string;
        chapterId: string
    }
}) {
    try {
        const {userId} = auth()
        const {isPublished, ...values} = await req.json()
        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        const ownCourse = await db.course.findUnique({
            where: {
                id:params.courseId
            }
        })
        if(!ownCourse) return new NextResponse("Unauthorized", {status: 403})

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values
            }
        })

        // TODO: handle video upload

        return NextResponse.json(chapter, {status: 200})
    } catch (error) {
        console.log("[COURSES_CHAPTER_PATCH]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}