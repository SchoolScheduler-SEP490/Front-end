'use client';

import React from 'react';
import { useAppContext } from '@/context/app_provider';
import SMHeader from '@/commons/school_manager/header';
import TeacherTimetableTable from './_components/teacher_timetable_table';

export default function TeacherTimetablePage() {
  const { schoolId, sessionToken } = useAppContext();

  return (
    <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
      <SMHeader>
        <h3 className="text-title-small text-white font-semibold tracking-wider">
          Thời khóa biểu giáo viên
        </h3>
      </SMHeader>

      <div className="w-full h-fit flex flex-col justify-center items-center px-[8vw] pt-[5vh]">
        <TeacherTimetableTable 
          schoolId={schoolId}
          sessionToken={sessionToken}
        />
      </div>
    </div>
  );
}
