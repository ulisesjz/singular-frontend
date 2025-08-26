import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { createUser, connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const {name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    // Ensure database connection
    await connectDB();

     const hashedPassword = await hash(password, 10);
     const res = await createUser(name, email, hashedPassword);

    return NextResponse.json(res, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to register user" },
      { status: 500 }
    );
  }
}
