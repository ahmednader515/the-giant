import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isGradeValue } from "@/lib/grades";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { grade: true, role: true },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    return NextResponse.json({ grade: user.grade, role: user.role });
  } catch (error) {
    console.error("[USER_GRADE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const role = session?.user?.role;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only students can self-edit grade
    if (role !== "USER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const grade = body?.grade;

    if (!isGradeValue(grade)) {
      return new NextResponse("Invalid grade", { status: 400 });
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { grade },
      select: { grade: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[USER_GRADE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

