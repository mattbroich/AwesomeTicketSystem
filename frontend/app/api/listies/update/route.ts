import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

export async function POST(request: Request) {
    try {
        const prisma = new PrismaClient();
        const { listy } = await request.json();

        if (!listy) {
            return NextResponse.json({ message: "Listy data is required" }, { status: 400 });
        }

        if (!listy.id || !listy.uId) {
            return NextResponse.json({ message: "Listy ID and User ID are required" }, { status: 400 });
        }

        if (!listy.name || listy.name.trim() === "") {
            return NextResponse.json({ message: "Listy name is required" }, { status: 400 });
        }

        if (!listy.collectionId) {
            return NextResponse.json({ message: "Collection ID is required" }, { status: 400 });
        }

        const updatedListy = await prisma.listies.update({
            where: {
                id: parseInt(listy.id),
                userId: parseInt(listy.uId)
            },
            data: {
                name: listy.name,
                description: listy.description || "",
                isFavorited: listy.isFavorited || false,
                categoriesId: parseInt(listy.collectionId)
            }
        });

        if (!updatedListy) {
            return NextResponse.json({ message: "Failed to update listy" }, { status: 500 });
        }

        return NextResponse.json({ data: updatedListy, message: `The Listy with an ID of ${listy.id} has been successfully updated.` }, { status: 200 });
    } catch (e) {
        console.error("Error initializing PrismaClient:", e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}