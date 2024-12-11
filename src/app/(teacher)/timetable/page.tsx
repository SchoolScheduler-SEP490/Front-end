"use client";

import React from "react";
import TeacherTimetableTable from "./_components/timetable_table";
import { useAppContext } from "@/context/app_provider";
import TeacherHeader from "@/commons/teacher/header";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function TeacherTimetablePage() {
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
        <TeacherHeader>
          <h3 className="text-title-small text-white font-semibold tracking-wider">
            Thời khóa biểu chính thức
          </h3>
        </TeacherHeader>

        <div className="w-full h-fit flex flex-col justify-center items-center px-[2vw] pt-[5vh]">
          <TeacherTimetableTable
            schoolId={schoolId}
            schoolYearId={selectedSchoolYearId}
            sessionToken={sessionToken}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
}
