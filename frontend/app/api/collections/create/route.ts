import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";


export async function POST(request: Request) {
    try {
        const prisma = new PrismaClient();
        const { userId, collection  } = await request.json();

        if (!userId) {
            return NextResponse.json({ message: "User ID was null, please log back in and try again" }, { status: 400 });
        }

        if (!collection) {
            return NextResponse.json({ message: "Collection data is required" }, { status: 400 });
        }

        if (!collection.name || collection.name.trim() === "") {
            return NextResponse.json({ message: "Collection name is required" }, { status: 400 });
        }

        const createdCollection = await prisma.categories.create({
            data: {
                name: collection.name,
                description: collection.description || "",
                imageUrl: collection.imageUrl || "",
                userId: parseInt(userId),
            }
        });

        if (!createdCollection) {
            return NextResponse.json({ message: "Failed to create collection" }, { status: 500 });
        }

        return NextResponse.json({ data: createdCollection, message: "success" }, { status: 200 });
    } catch (e) {
        console.error(e);
    }

    return NextResponse.json({ message: "success" });
}

export async function GET(request: Request) {
    const cookie = request.headers.get("cookie");

    if (!cookie) {
        return NextResponse.json({ userId: null, message: "No cookie provided" }, { status: 400 });
    }

    const match = cookie.match(/userId=(\d+)/);
    const userId = match ? match[1] : null;

    return NextResponse.json({ userId: userId }, { status: 200 });
}