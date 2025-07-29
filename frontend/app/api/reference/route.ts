import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

export async function POST(request: Request) {
    try{
        const reference = await request.json();

        if (!reference || !reference.id) {
            return NextResponse.json({ message: "No reference ID provided" }, { status: 400 });
        }

        const prisma = new PrismaClient();

        const ref = await prisma.reference.create({
            data: {
              uuid: reference.id,
              referredByUserId: reference.referredByUserId,
              user: {
                connect: {
                  email: reference.toEmail
                },
              },
            },
          })

        return NextResponse.json({ reference: ref, message: "success" }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred while fetching references" }, { status: 500 });
    }
}