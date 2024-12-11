'use client';

import React from "react";
import TeacherTimetable from "./_components/teacher_timetable";
import { useAppContext } from "@/context/app_provider";
import TeacherHeader from "@/commons/teacher/header";

export default function TeacherDashboardPage() {
  const { schoolId, sessionToken, userRole } = useAppContext();

  console.log("Context values:", { schoolId, sessionToken, userRole }); // Debug log

  if (!schoolId || !userRole) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
      <TeacherHeader>
        <h3 className="text-title-small text-white font-semibold tracking-wider">
          Lịch dạy học dự kiến
        </h3>
      </TeacherHeader>

      <div className="w-full h-fit flex flex-col justify-center items-center px-[8vw] pt-[5vh]">
        <TeacherTimetable
          schoolId={schoolId}
          sessionToken={sessionToken}
          teacherAbbr={userRole}
        />
      </div>
    </div>
  );
}
