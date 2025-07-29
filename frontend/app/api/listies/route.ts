import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

export async function POST(request: Request) {
  try {
    const prisma = new PrismaClient();
    const {userId, collectionId} = await request.json();
    
    if (!userId) {
      return NextResponse.json({ message: "User ID was null, please log back in and try again" }, { status: 400 });
    }

    if (!collectionId) {
      return NextResponse.json({ message: "Collection ID is required" }, { status: 400 });
    }
    
    const listies = await prisma.listies.findMany({
        where: {
            userId: parseInt(userId),
            categoriesId: parseInt(collectionId),
            isDeleted: false
        },
        include: {
            user: true,
            categories: true
        },
        orderBy: {
          isFavorited: 'asc'
        }
    });
    return NextResponse.json({ data: listies ?? [], message: "success" }, { status: 200 });
  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: "success" });
}