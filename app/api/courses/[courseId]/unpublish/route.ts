import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import {db} from "@/lib/db";

export async function PATCH(req: Request, {params}: {
    params: {
        courseId: string
    }
}) {
    try {
        const {userId} = auth()
        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if (!course) {
            return new NextResponse("Not Found", {status: 404})
        }


        const unpublishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId
            },
            data: {
                isPublished: false
            }
        })

        return NextResponse.json(unpublishedCourse, {status: 200})


    } catch (error) {
        console.log('[COURSE_ID_UNPUBLISHED_PATCH]', error)
        return new NextResponse("Internal Error", {status: 500})
    }
}