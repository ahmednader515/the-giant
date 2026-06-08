"use client";

import { useState } from "react";
import { Copy, Check, Link2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildChapterPublicUrl } from "@/lib/chapter-public-link";

interface ChapterPublicLinkProps {
  publicShortCode: string;
  isPublished?: boolean;
}

export function ChapterPublicLink({
  publicShortCode,
  isPublished = true,
}: ChapterPublicLinkProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = buildChapterPublicUrl(publicShortCode);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("تم نسخ الرابط");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("تعذر نسخ الرابط");
    }
  };

  return (
    <div className="border bg-card rounded-md p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-brand" />
        <h3 className="font-medium">رابط المشاركة العام</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        يمكن لأي شخص فتح هذا الرابط ومشاهدة الفصل دون تسجيل الدخول.
        {!isPublished && " سيصبح الرابط فعالاً بعد نشر الفصل."}
      </p>
      <div className="flex items-center gap-2">
        <Input value={publicUrl} readOnly className="h-10 text-sm" dir="ltr" />
        <Button
          type="button"
          variant="outline"
          onClick={copyLink}
          className="shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 ml-2" />
              تم النسخ
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 ml-2" />
              نسخ
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
