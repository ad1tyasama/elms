import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; testId: string } }
) {
  try {
    const { userId } = auth();
    const { title, isCorrect } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const test = await db.test.findUnique({
      where: {
        id: params.testId,
        courseId: params.courseId,
      },
    });

    if (!test) {
      return new NextResponse("No data found", { status: 404 });
    }

    const variant = await db.variant.create({
      data: {
        title,
        isCorrect,
        testId: params.testId,
      },
    });

    return NextResponse.json(variant);
  } catch (error) {
    console.log("[VARIANTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
