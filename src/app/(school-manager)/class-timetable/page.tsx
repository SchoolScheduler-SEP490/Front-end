'use client';

import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/app_provider';
import SMHeader from '@/commons/school_manager/header';
import { FormControl, Select, MenuItem } from '@mui/material';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { firestore } from '@/utils/firebaseConfig';
import ClassTimetableTable from './_components/class_timetable_table';

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
			scrollbars: 'none',
		},
	},
};

export default function ClassTimetablePage() {
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [publishedTimetable, setPublishedTimetable] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    const fetchPublishedTimetable = async () => {
      try {
        // Query for published timetable
        const timetablesRef = collection(firestore, 'timetables');
        const q = query(
          timetablesRef,
          where('school-id', '==', Number(schoolId)),
          where('status', '==', 'Published')
        );
        
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const timetableDoc = snapshot.docs[0];
          const scheduleRef = doc(firestore, 'schedule-responses', timetableDoc.data()['generated-schedule-id']);
          const scheduleSnap = await getDoc(scheduleRef);
          
          if (scheduleSnap.exists()) {
            const scheduleData = scheduleSnap.data();
            setPublishedTimetable(scheduleData);
            
            // Extract unique class names
            const classNames = scheduleData['class-schedules'].map(
              (schedule: any) => schedule['student-class-name']
            );
            setClasses(Array.from(new Set(classNames)));
          }
        }
      } catch (error) {
        console.error('Error fetching timetable:', error);
      }
    };
    fetchPublishedTimetable();
  }, [schoolId]);

  return (
    <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
      <SMHeader>
        <h3 className="text-title-small text-white font-semibold tracking-wider">
          Thời khóa biểu lớp
        </h3>
      </SMHeader>

      <div className="w-full h-fit flex flex-col justify-center items-center px-[8vw] pt-[5vh]">
        <div className="w-full mb-6 flex justify-between items-center">
          <FormControl sx={{ minWidth: 170 }}>
            <Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              displayEmpty
              MenuProps={MenuProps}
            >
              <MenuItem value="">Chọn lớp</MenuItem>
              {classes.map((className) => (
                <MenuItem key={className} value={className}>
                  {className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {publishedTimetable && (
          <ClassTimetableTable 
            scheduleData={publishedTimetable}
            selectedClass={selectedClass}
          />
        )}
      </div>
    </div>
  );
}
