import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { PrismaClient } from "@/lib/generated/prisma";

export async function POST(request: Request) {
  try {
    const prisma = new PrismaClient();

    const { email, password, confirmPassword } = await request.json();

    if (password !== confirmPassword) {
        return NextResponse.json({ error: "Passwords do not match" }, { status: 402 });
    }

    const hashedPassword = await hash(password, 10);    // Hash the password with bcrypt
    
    const user = await prisma.user.create({
        data: {
            email: email,
            hash: hashedPassword,
            name: email.split("@")[0]
        },
    });

    if (!user) {
        return NextResponse.json({ error: "User creation failed" }, { status: 500 });
    }

    console.log("User created successfully:", user);

    return NextResponse.json({ user: user }, { status: 200 });
  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: "success" });
}