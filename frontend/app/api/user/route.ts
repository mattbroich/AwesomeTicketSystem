import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

export async function POST(request: Request) {
        try {
            const cookie = request.headers.get("cookie");

        if (!cookie) {
            return NextResponse.json({ userId: null, message: "No cookie provided" }, { status: 400 });
        }

        const match = cookie.match(/userId=(\d+)/);
        const userId = match ? match[1] : null;

        if (!userId) {
            return NextResponse.json({ message: "No user ID found in cookie" }, { status: 400 });
        }

        const prisma = new PrismaClient();

        const user = await prisma.user.findMany({
            where: {
                id: parseInt(userId)
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        if (!user) {
            return NextResponse.json({ message: "No User found for this ID" }, { status: 404 });
        }

        return NextResponse.json({ user: user, message: "success" }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred while fetching users" }, { status: 500 });
    }
}