"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CourseNavbar } from "./_components/course-navbar";
import { CourseSidebar } from "./_components/course-sidebar";

function CourseLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const searchParams = useSearchParams();
    const isPublicView = searchParams.has("public");

    return (
        <div className="min-h-screen flex flex-col course-layout">
            <div className="h-[80px] fixed inset-x-0 top-0 w-full z-50">
                <CourseNavbar isPublicView={isPublicView} />
            </div>
            {!isPublicView && (
                <div className="hidden md:flex h-[calc(100vh-80px)] w-64 md:w-80 flex-col fixed inset-y-0 top-[80px] right-0 z-40 border-l">
                    <CourseSidebar />
                </div>
            )}
            <main className={`pt-[80px] flex-1 ${isPublicView ? "" : "md:pr-64 md:lg:pr-80"}`}>
                {children}
            </main>
        </div>
    );
}

const CourseLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <CourseLayoutContent>{children}</CourseLayoutContent>
        </Suspense>
    );
}

export default CourseLayout; 