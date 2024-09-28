import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; testId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const test = await db.test.findUnique({
      where: {
        id: params.testId,
        courseId: params.courseId,
      },
    });

    if (!test) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedTest = await db.test.delete({
      where: {
        id: params.testId,
      },
    });

    const publishedTestsInCourse = await db.test.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedTestsInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedTest);
  } catch (error) {
    console.log("[TEST_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
