import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const { title } = await req.json();
    if (!title) return new NextResponse("Title is required", { status: 400 });

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) return new NextResponse("Unauthorized", { status: 403 });

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    console.log("[COURSE_CHAPTER_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
