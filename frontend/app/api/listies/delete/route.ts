import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";


export async function POST(request: Request) {
    try {
        const prisma = new PrismaClient();

        const {listyId, userId} = await request.json();

        if (!listyId) {
            return NextResponse.json({ message: "Listy ID is required" }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ message: "User ID was null, please log back in and try again" }, { status: 400 });
        }

        const deletedListy = await prisma.listies.update({
            where: {
                id: parseInt(listyId),
                userId: parseInt(userId)
            },
            data: {
                isDeleted: true,                
            }
        });

        if (!deletedListy) {
            return NextResponse.json({ message: "Failed to delete listy" }, { status: 500 });
        }

        return NextResponse.json({ message: `The Listy with an ID of "${listyId}" has been successfully deleted.` }, { status: 200 });
    } catch (e) {
        console.error("Error initializing PrismaClient:", e);
        return NextResponse.json({ message: "Failed to initialize database connection" }, { status: 500 });
    }
}