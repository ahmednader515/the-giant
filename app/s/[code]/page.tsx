import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function ShortChapterLinkPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const chapter = await db.chapter.findFirst({
    where: { publicShortCode: code },
    select: {
      id: true,
      courseId: true,
      publicAccessToken: true,
      isPublished: true,
      course: {
        select: { isPublished: true },
      },
    },
  });

  if (
    !chapter ||
    !chapter.publicAccessToken ||
    !chapter.isPublished ||
    !chapter.course.isPublished
  ) {
    redirect("/");
  }

  redirect(
    `/courses/${chapter.courseId}/chapters/${chapter.id}?public=${chapter.publicAccessToken}`
  );
}
