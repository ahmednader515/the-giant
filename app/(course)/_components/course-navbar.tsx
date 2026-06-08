"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { ChevronRight, LogOut } from "lucide-react";
import { CourseMobileSidebar } from "./course-mobile-sidebar";
import { UserButton } from "@/components/user-button";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export const CourseNavbar = ({ isPublicView = false }: { isPublicView?: boolean }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout API to end session
      await fetch("/api/auth/logout", { method: "POST" });
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push(isPublicView ? "/" : "/dashboard");
  };

  return (
    <div className="p-4 h-full flex items-center bg-card text-foreground border-b shadow-sm">
      <div className="flex items-center">
        {!isPublicView && <CourseMobileSidebar />}
        <Button
          onClick={handleBackToDashboard}
          variant="ghost"
          size="sm"
          className="flex items-center gap-x-2 hover:bg-slate-100 rtl:mr-2 ltr:ml-2"
        >
          <span className="rtl:text-right ltr:text-left">
            {isPublicView ? "الرجوع إلى الصفحة الرئيسية" : "الرجوع إلى الكورسات"}
          </span>
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </Button>
      </div>
      <div className="flex items-center gap-x-4 rtl:mr-auto ltr:ml-auto">
        {isPublicView && !session?.user && (
          <Button asChild size="sm" className="bg-brand hover:bg-brand/90 text-white">
            <Link href="/sign-in">تسجيل الدخول</Link>
          </Button>
        )}
        {session?.user && (
          <LoadingButton 
            size="sm" 
            variant="ghost" 
            onClick={handleLogout}
            loading={isLoggingOut}
            loadingText="جاري تسجيل الخروج..."
            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 ease-in-out"
          >
            <LogOut className="h-4 w-4 rtl:ml-2 ltr:mr-2"/>
            تسجيل الخروج
          </LoadingButton>
        )}
        {!isPublicView && <UserButton />}
      </div>
    </div>
  );
}; 