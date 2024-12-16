'use client';

import React from 'react';
import { useAppContext } from '@/context/app_provider';
import SMHeader from '@/commons/school_manager/header';
import PublishTimetableTable from './_components/publish-timetable-table';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSMSelector } from '@/hooks/useReduxStore';

export default function PublishTimetablePage() {
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const {isMenuOpen} = useSMSelector((state) => state.schoolManager);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={`w-[${!isMenuOpen ? '84' : '100'}%] h-screen flex flex-col justify-start items-start `}>
        <SMHeader>
          <h3 className="text-title-small text-white font-semibold tracking-wider">
            Thời khóa biểu đã công bố
          </h3>
        </SMHeader>
        <div className="w-full h-fit flex flex-col justify-center items-center pt-[5vh]">
          <PublishTimetableTable 
            schoolId={schoolId}
            schoolYearId={selectedSchoolYearId}
            sessionToken={sessionToken}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
}
