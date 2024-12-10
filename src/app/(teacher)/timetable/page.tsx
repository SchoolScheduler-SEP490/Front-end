'use client';

import React from "react";
import TeacherTimetableTable from "./_components/timetable_table";
import { useAppContext } from "@/context/app_provider";
import TeacherHeader from "@/commons/teacher/header";

export default function TeacherTimetablePage() {
  const { schoolId, sessionToken, userRole } = useAppContext();

  return (
    <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
      <TeacherHeader>
        <h3 className="text-title-small text-white font-semibold tracking-wider">
          Thời khóa biểu
        </h3>
      </TeacherHeader>

      <div className="w-full h-fit flex flex-col justify-center items-center px-[8vw] pt-[5vh]">
        <TeacherTimetableTable
          schoolId={schoolId}
          sessionToken={sessionToken}
          teacherAbbr={userRole}
        />
      </div>
    </div>
  );
}
