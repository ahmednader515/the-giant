import { randomBytes, randomUUID } from "crypto";
import { db } from "@/lib/db";

const SHORT_CODE_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateShortCode(length = 8) {
  const bytes = randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += SHORT_CODE_CHARS[bytes[i] % SHORT_CODE_CHARS.length];
  }
  return code;
}

async function generateUniqueShortCode() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateShortCode();
    const existing = await db.chapter.findUnique({
      where: { publicShortCode: code },
      select: { id: true },
    });
    if (!existing) return code;
  }
  return generateShortCode(12);
}

export async function ensureChapterPublicAccess(chapterId: string) {
  const chapter = await db.chapter.findUnique({
    where: { id: chapterId },
    select: { publicAccessToken: true, publicShortCode: true },
  });

  if (!chapter) return null;

  if (chapter.publicAccessToken && chapter.publicShortCode) {
    return {
      publicAccessToken: chapter.publicAccessToken,
      publicShortCode: chapter.publicShortCode,
    };
  }

  const updated = await db.chapter.update({
    where: { id: chapterId },
    data: {
      publicAccessToken: chapter.publicAccessToken || randomUUID(),
      publicShortCode: chapter.publicShortCode || (await generateUniqueShortCode()),
    },
    select: { publicAccessToken: true, publicShortCode: true },
  });

  return updated;
}

export async function ensureChapterPublicToken(chapterId: string) {
  const access = await ensureChapterPublicAccess(chapterId);
  return access?.publicAccessToken ?? null;
}

export async function getChapterByPublicToken(
  courseId: string,
  chapterId: string,
  publicToken: string | null
) {
  if (!publicToken) return null;

  return db.chapter.findFirst({
    where: {
      id: chapterId,
      courseId,
      publicAccessToken: publicToken,
      isPublished: true,
      course: {
        isPublished: true,
      },
    },
    include: {
      attachments: {
        orderBy: {
          position: "asc",
        },
      },
      course: {
        select: {
          title: true,
        },
      },
    },
  });
}

export function getPublicTokenFromRequest(req: Request) {
  const url = new URL(req.url);
  return url.searchParams.get("public");
}
