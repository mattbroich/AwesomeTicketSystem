import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";


export async function POST(request: Request) {
    try {
        const prisma = new PrismaClient();

        const { userId, collectionId } = await request.json();

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        if (!collectionId) {
            return NextResponse.json({ message: "Collection ID is required" }, { status: 400 });
        }

        const fetchAssociatedListies = await prisma.listies.findMany({
            where: {
                userId: parseInt(userId),
                categoriesId: parseInt(collectionId),
                isDeleted: false
            }
        });

        // If listies exist under the collection, delete them
        if (fetchAssociatedListies.length > 0) {
            const deletedListies = await prisma.listies.updateMany({
                where: {
                    userId: parseInt(userId),
                    categoriesId: parseInt(collectionId),
                    isDeleted: false
                },
                data: {
                    isDeleted: true
                }
            });

            if (!deletedListies) {
                return NextResponse.json({ message: "Failed to delete associated Listies" }, { status: 500 });
            }
        }

        const deletedCollection = await prisma.categories.update({
            where: {
                id: parseInt(collectionId),
                userId: parseInt(userId)
            },
            data: {
                isDeleted: true
            }
        });

        if (!deletedCollection) {
            return NextResponse.json({ message: "Failed to delete collection" }, { status: 500 });
        }

        return NextResponse.json({ message: `The collection with an ID of "${collectionId}" and all associated Listies have been successfully deleted.` }, { status: 200 });
    } catch (e) {
        console.error("Error initializing PrismaClient:", e);
        return NextResponse.json({ message: e }, { status: 500 });
    }
}