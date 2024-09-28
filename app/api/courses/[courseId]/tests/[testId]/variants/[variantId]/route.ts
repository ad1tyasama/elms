import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { courseId: string; testId: string; variantId: string } }
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

    const variant = await db.variant.findUnique({
      where: {
        id: params.variantId,
        testId: params.testId,
      },
    });

    if (!variant) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedVariant = await db.variant.delete({
      where: {
        id: params.variantId,
      },
    });

    return NextResponse.json(deletedVariant);
  } catch (error) {
    console.log("[VARIANT_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
