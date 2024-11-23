'use client';
import { useAppContext } from '@/context/app_provider';
import useFetchTerm from '@/hooks/useFetchTerm';
import { useEffect, useState } from 'react';
import {
	IClassResponse,
	ITeachersLessonsObject,
	ITeachersLessonsSidenavData,
} from './_libs/constants';
import useFetchClassData from './_hooks/useFetchClass';
import useSidenavDataConverter from './_hooks/useSidenavDataConverter';
import TeachersLessonsSideNav from './_components/teachers_lessons_sidenav';
import TeachersLessonsTable from './_components/teachers_lessons_table';
import useFetchTeacher from './_hooks/useFetchTeacher';
import { useSelector } from 'react-redux';
import { IConfigurationStoreObject } from '../../_libs/constants';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import useFetchSubject from './_hooks/useFetchSubject';

export default function Home() {
	const { selectedSchoolYearId, schoolId, sessionToken } = useAppContext();
	const { dataFirestoreName }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);

	const [selectedClassId, setSelectedClassId] = useState<number>(0);
	const [selectedGrade, setSelectedGrade] = useState<string>('');
	const [editingObjects, setEditingObjects] = useState<ITeachersLessonsObject[]>([]);

	const [sidenavData, setSidenavData] = useState<ITeachersLessonsSidenavData[]>([]);

	const {
		data: teacherData,
		mutate: updateTeacher,
		isValidating: isTeacherValidating,
	} = useFetchTeacher({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
	});

	const {
		data: classData,
		isValidating: isClassValidating,
		mutate: updateClass,
	} = useFetchClassData({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
		schoolYearId: selectedSchoolYearId,
	});

	const {
		data: subjectData,
		mutate: updateSubject,
		isValidating: isSubjectValidating,
	} = useFetchSubject({
		sessionToken,
		schoolYearId: selectedSchoolYearId,
		pageSize: 100,
		pageIndex: 1,
	});

	useEffect(() => {
		updateTeacher();
		if (
			teacherData?.status === 200 &&
			subjectData?.status === 200 &&
			classData?.status === 200 &&
			dataFirestoreName
		) {
			const tmpEditingObjects: ITeachersLessonsObject[] = [];
		}
	}, [teacherData]);

	useEffect(() => {
		updateClass();
		if (classData?.status === 200) {
			const tmpData: ITeachersLessonsSidenavData[] = useSidenavDataConverter(
				classData.result.items as IClassResponse[]
			);
			if (tmpData.length > 0) {
				setSidenavData(tmpData);
				setSelectedClassId(tmpData[0].items[0].value);
				setSelectedGrade(tmpData[0].grade);
			}
		}
	}, [classData]);

	return (
		<div className='w-full h-screen flex flex-col justify-start items-start'>
			<div className='w-full h-full flex flex-row justify-start items-start overflow-y-hidden'>
				<TeachersLessonsSideNav
					selectedClass={selectedClassId}
					setSelectedClass={setSelectedClassId}
					classData={sidenavData}
					setSelectedGrade={setSelectedGrade}
				/>
				<div className='w-[85%] h-full flex justify-center items-start gap-5'>
					<div className='w-full h-[85vh] pt-[5vh] px-[5vw] overflow-y-scroll no-scrollbar'>
						<TeachersLessonsTable />
					</div>
				</div>
			</div>
		</div>
	);
}
