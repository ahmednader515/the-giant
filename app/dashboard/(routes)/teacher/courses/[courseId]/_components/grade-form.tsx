"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADE_OPTIONS, type GradeValue } from "@/lib/grades";

interface GradeFormProps {
  initialData: {
    grade: GradeValue | null;
  };
  courseId: string;
}

export const GradeForm = ({ initialData, courseId }: GradeFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggleEdit = () => setIsEditing((c) => !c);

  const label =
    initialData.grade == null
      ? "للجميع"
      : GRADE_OPTIONS.find((g) => g.value === initialData.grade)?.label ?? initialData.grade;

  const onSave = async (value: string) => {
    try {
      setIsSaving(true);
      const nextGrade = value === "ALL" ? null : (value as GradeValue);
      await axios.patch(`/api/courses/${courseId}`, { grade: nextGrade });
      toast.success("تم تحديث الصف المستهدف");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-6 border bg-card rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        الصف المستهدف
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>إلغاء</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              تعديل
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-sm mt-2 text-muted-foreground">{label}</p>
      )}

      {isEditing && (
        <div className="mt-4 space-y-3">
          <Select
            defaultValue={initialData.grade ?? "ALL"}
            onValueChange={onSave}
            disabled={isSaving}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="اختر الصف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">للجميع</SelectItem>
              {GRADE_OPTIONS.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            إذا اخترت (للجميع) سيظهر الكورس لكل الطلاب بغض النظر عن الصف.
          </p>
        </div>
      )}
    </div>
  );
};

