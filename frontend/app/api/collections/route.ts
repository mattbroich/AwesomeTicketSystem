import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

export async function POST(request: Request) {
    try {
        const prisma = new PrismaClient();
        const userId = await request.json().then(data => data.userId);

        const collection = await prisma.categories.findMany({
            where: {
                userId: parseInt(userId)
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        if (!collection) {
            return NextResponse.json({ message: "No collections found for this user" }, { status: 404 });
        }

        return NextResponse.json({ collections: collection, message: "success" }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred while fetching collections" }, { status: 500 });
    }
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