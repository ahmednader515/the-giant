export const GRADE_OPTIONS = [
  { value: "FIRST_SECONDARY", label: "الصف الأول الثانوي" },
  { value: "SECOND_SECONDARY", label: "الصف الثاني الثانوي" },
  { value: "THIRD_SECONDARY", label: "الصف الثالث الثانوي" },
] as const;

export type GradeValue = (typeof GRADE_OPTIONS)[number]["value"];

export function isGradeValue(value: unknown): value is GradeValue {
  return (
    typeof value === "string" &&
    (GRADE_OPTIONS as readonly { value: string }[]).some((g) => g.value === value)
  );
}

