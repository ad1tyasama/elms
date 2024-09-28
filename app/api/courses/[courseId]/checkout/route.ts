import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.username) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const existing_enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (existing_enrollment) {
      return new NextResponse("Already enrolled", { status: 400 });
    }

    const new_enrollment = await db.enrollment.create({
      data: {
        courseId: params.courseId,
        userId: user.id,
      },
    });

    return NextResponse.json(new_enrollment);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
