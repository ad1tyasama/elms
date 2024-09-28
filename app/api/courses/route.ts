import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, res: NextResponse) {
  try {
    const { userId } = auth();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const folderId = new URL(req.url).searchParams.get('folderId')

    if (!folderId) {
      return new NextResponse("Please select a folder", { status: 400 });
    }
    const gdVideoData: any[] = await db.gDVideo.findMany({
      where: {
        folderId : folderId
      }
    });

    const gdVideos = gdVideoData.map((video) => ({
      id: video.id,
      name: video.name,
      folderId: video.folderId,
    }));

    return new NextResponse(JSON.stringify(gdVideos), { status: 200 });
  } catch (error) {
    console.error("Error fetching videos List:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}