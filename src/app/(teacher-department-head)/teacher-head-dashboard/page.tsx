"use client";

import React from "react";
import { useAppContext } from "@/context/app_provider";
import TeacherHeadHeader from "@/commons/teacher_department_head/header";
import TeacherHeadTimetableTable from "./_components/teacher_head_timetable";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function TeacherHeadDashboardPage() {
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
        <TeacherHeadHeader>
          <h3 className="text-title-small text-white font-semibold tracking-wider">
            Thời khóa biểu giáo viên
          </h3>
        </TeacherHeadHeader>
        <div className="w-full h-fit flex flex-col justify-center items-center px-[2vw] pt-[5vh]">
          <TeacherHeadTimetableTable
            schoolId={schoolId}
            schoolYearId={selectedSchoolYearId}
            sessionToken={sessionToken}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
}
