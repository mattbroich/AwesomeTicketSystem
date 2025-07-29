import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";


export async function POST(request: Request) {
    try {
        console.log("Creating a new listy...");
        const prisma = new PrismaClient();
        const { listy } = await request.json();

        console.log(listy);

        if (!listy) {
            return NextResponse.json({ message: "Listy data is required" }, { status: 400 });
        }

        if (!listy.uId) {
            return NextResponse.json({ message: "User ID was null, please log back in and try again" }, { status: 400 });
        }

        if (!listy.name || listy.name.trim() === "") {
            return NextResponse.json({ message: "Listy name is required" }, { status: 400 });
        }

        const createdListy = await prisma.listies.create({
            data: {
                name: listy.name,
                description: listy.description || "",
                isFavorited: listy.isFavorited || false,
                userId: parseInt(listy.uId),
                categoriesId: parseInt(listy.collectionId)
            }
        });

        if (!createdListy) {
            return NextResponse.json({ message: "Failed to create listy" }, { status: 500 });
        }

        return NextResponse.json({ data: createdListy, message: "success" }, { status: 200 });
    } catch (e) {
        console.error("Error initializing PrismaClient:", e);
        return NextResponse.json({ message: e }, { status: 500 });
    }
}