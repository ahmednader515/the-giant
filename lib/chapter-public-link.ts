const DEFAULT_APP_URL = "https://the-giant.vercel.app";

export function getAppBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || DEFAULT_APP_URL).replace(/\/$/, "");
}

export function buildChapterPublicUrl(publicShortCode: string) {
  return `${getAppBaseUrl()}/s/${publicShortCode}`;
}
