import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: any, res: NextResponse) {
  try {
    const folders: any[] = await db.folderId.findMany()

    const folderss = folders.map((folder) => ({
      id: folder.id,
      name: folder.name
    }));

    return new Response(JSON.stringify(folderss), { status: 200 });
  } catch (error) {
    console.error("Error fetching videos List:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}