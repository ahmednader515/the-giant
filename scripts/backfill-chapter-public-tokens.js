const { PrismaClient } = require("@prisma/client");
const { randomBytes, randomUUID } = require("crypto");

const db = new PrismaClient();
const SHORT_CODE_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateShortCode(length = 8) {
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

async function main() {
  const chapters = await db.chapter.findMany({
    where: {
      OR: [{ publicAccessToken: null }, { publicShortCode: null }],
    },
    select: { id: true, publicAccessToken: true, publicShortCode: true },
  });

  for (const chapter of chapters) {
    await db.chapter.update({
      where: { id: chapter.id },
      data: {
        publicAccessToken: chapter.publicAccessToken || randomUUID(),
        publicShortCode: chapter.publicShortCode || (await generateUniqueShortCode()),
      },
    });
  }

  console.log(`Backfilled ${chapters.length} chapters`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
