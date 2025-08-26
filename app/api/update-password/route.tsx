import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { auth } from "@/lib/auth";
import { updateUserPassword, connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }

    const { password } = await req.json();

    if (!password || password.length < 6) {
      return NextResponse.json({ message: "Password too short." }, { status: 400 });
    }

    // Ensure database connection
    await connectDB();

    const hashedPassword = await hash(password, 10);

    const updatedUser = await updateUserPassword(session.user.email, hashedPassword);

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error: any) {
    console.error("Error updating password:", error);
    return NextResponse.json({ message: "Failed to update password." }, { status: 500 });
  }
}
