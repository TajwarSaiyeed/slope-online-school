import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
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
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        chapters: true,
      },
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course ||
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !hasPublishedChapter ||
      !course.categoryId
    ) {
      return new NextResponse("Missing required field", { status: 401 });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCourse, { status: 200 });
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
