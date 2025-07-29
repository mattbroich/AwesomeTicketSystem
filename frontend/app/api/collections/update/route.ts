import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";


export async function POST(request: Request) {
    try {
        const prisma = new PrismaClient();
        const { collection } = await request.json();

        if (!collection || !collection.id) {
            return NextResponse.json({ message: "Collection ID is required" }, { status: 400 });
        }

        if (!collection.name || collection.name.trim() === "") {
            return NextResponse.json({ message: "Collection name is required" }, { status: 400 });
        }

        const updatedCollection = await prisma.categories.update({
            where: {
                id: parseInt(collection.id),
                userId: parseInt(collection.uId)
            },
            data: {
                name: collection.name,
                description: collection.description || "",
                imageUrl: collection.imageUrl || ""
            }
        });

        if (!updatedCollection) {
            return NextResponse.json({ message: "Failed to update collection" }, { status: 500 });
        }

        return NextResponse.json({ data: updatedCollection, message: `The collection with an ID of ${collection.id} has been successfully updated.` }, { status: 200 });
    } catch (e) {
        console.error("Error initializing PrismaClient:", e);
        return NextResponse.json({ message: "Failed to initialize database connection" }, { status: 500 });
    }
}