import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import {db} from "@/lib/db";

export async function DELETE(req: Request, {params}: {
    params: {
        courseId: string;
        chapterId: string
    }
}) {
    try {
        const {userId} = auth()
        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })
        if (!ownCourse) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
        })
        if (!chapter) {
            return new NextResponse("Not found", {status: 404})
        }

        const deleteChapter = await db.chapter.delete({
            where: {
                id: params.chapterId,
            },
        })
        const publishedChapterInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        })

        if (!publishedChapterInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(deleteChapter, {status: 200})
    } catch (error) {
        console.log("[COURSES_CHAPTER_DELETE]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}

export async function PATCH(req: Request, {params}: {
    params: {
        courseId: string;
        chapterId: string
    }
}) {
    try {
        const {userId} = auth()
        const {isPublished, ...values} = await req.json()
        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })
        if (!ownCourse) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(chapter, {status: 200})
    } catch (error) {
        console.log("[COURSES_CHAPTER_PATCH]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}