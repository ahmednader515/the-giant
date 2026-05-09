"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADE_OPTIONS, type GradeValue } from "@/lib/grades";

type Props = {
  initialGrade: GradeValue | null;
  variant?: "warning" | "normal";
};

export function StudentGradeCard({ initialGrade, variant = "normal" }: Props) {
  const [grade, setGrade] = useState<GradeValue | null>(initialGrade);
  const [selected, setSelected] = useState<GradeValue | "">(initialGrade ?? "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setGrade(initialGrade);
    setSelected(initialGrade ?? "");
  }, [initialGrade]);

  const label = useMemo(() => {
    if (!grade) return "غير محدد";
    return GRADE_OPTIONS.find((g) => g.value === grade)?.label ?? grade;
  }, [grade]);

  const save = async () => {
    if (!selected) {
      toast.error("يرجى اختيار الصف الدراسي");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/grade", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade: selected }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed");
      }
      const data = (await res.json()) as { grade: GradeValue | null };
      setGrade(data.grade);
      toast.success("تم تحديث الصف الدراسي");
    } catch {
      toast.error("حدث خطأ أثناء حفظ الصف");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {variant === "warning" && !grade && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertDescription className="text-orange-800">
            لم يتم تحديد الصف الدراسي بعد. يرجى اختيار الصف حتى تظهر لك الكورسات المناسبة.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-card rounded-xl p-4 border">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm text-muted-foreground">الصف الدراسي الحالي</div>
            <div className="text-lg font-semibold">{label}</div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:w-64">
              <Select
                value={selected}
                onValueChange={(v) => setSelected(v as GradeValue)}
                disabled={isSaving}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="اختر الصف الدراسي" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_OPTIONS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={save}
              className="bg-brand hover:bg-brand/90 text-white"
              disabled={isSaving || !selected}
            >
              {isSaving ? "جارٍ الحفظ..." : "حفظ"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

