'use client';
import { useAppContext } from '@/context/app_provider';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TeachersLessonsSideNav from './_components/teachers_lessons_sidenav';
import TeachersLessonsTable from './_components/teachers_lessons_table';
import useFetchClassData from './_hooks/useFetchClass';
import useFetchSubject from './_hooks/useFetchSubject';
import useFetchTeachingAssignment from './_hooks/useFetchTeachingAssignment';
import useSidenavDataConverter from './_hooks/useSidenavDataConverter';
import {
	IAssignmentResponse,
	IClassResponse,
	ITeacherResponse,
	ITeachersLessonsObject,
	ITeachersLessonsSidenavData,
} from './_libs/constants';
import useFetchTeacher from './_hooks/useFetchTeacher';
import useNotify from '@/hooks/useNotify';
import { IFixedPeriodObject, ITeachingAssignmentObject } from '@/utils/constants';

export default function TeachersLessons() {
	const { selectedSchoolYearId, schoolId, sessionToken } = useAppContext();
	const { dataFirestoreName, timetableStored, dataStored }: ITimetableGenerationState =
		useSelector((state: any) => state.timetableGeneration);

	const [selectedClassId, setSelectedClassId] = useState<number>(0);
	const [selectedHomeroom, setSelectedHomeroom] = useState<string>('');
	const [maxSlot, setMaxSlot] = useState<number>(5);
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
	const {
		data: assignmentData,
		mutate: updateAssignment,
		isValidating: isAssignmentValidating,
	} = useFetchTeachingAssignment({
		sessionToken,
		schoolId: Number(schoolId),
		schoolYearId: selectedSchoolYearId,
		studentClassId: selectedClassId,
		termId: timetableStored['term-id'] ?? 0,
	});

	useEffect(() => {
		setEditingObjects([]);
		updateAssignment();
		updateTeacher();
		updateSubject();
		updateClass();
		if (
			assignmentData?.status === 200 &&
			subjectData?.status === 200 &&
			classData?.status === 200 &&
			teacherData?.status === 200 &&
			dataStored
		) {
			setSelectedHomeroom(
				assignmentData.result['home-room-teacher-of-class'].abbreviation ?? ''
			);
			const tmpEditingObjects: ITeachersLessonsObject[] = [];
			const availableSubjects: IAssignmentResponse[] = [
				...assignmentData.result['teacher-assignt-view'],
				...assignmentData.result['teacher-not-assignt-view'],
			];
			if (availableSubjects.length > 0) {
				// Duyệt toàn bộ môn học để lấy dữ liệu assign cơ bản
				availableSubjects.forEach((assignment: IAssignmentResponse) => {
					const assignedTeacher: ITeachingAssignmentObject | undefined = dataStored[
						'teacher-assignments'
					].find((item) => item.id === assignment.id);

					const availableTeacher: ITeacherResponse | undefined =
						teacherData.result.items.find(
							(teacher: ITeacherResponse) =>
								teacher.id === assignedTeacher?.['teacher-id']
						);
					if (availableTeacher) {
						tmpEditingObjects.push({
							classId: assignment['student-class-id'],
							// className: existingClass.name,
							teacherId: availableTeacher.id,
							teacherName: availableTeacher['abbreviation'],
							slots: [],
							subjectId: assignment['subject-id'],
							subjectName: assignment['subject-name'],
							totalSlotPerWeek: assignment['period-count'],
						} as ITeachersLessonsObject);
					}
				});

				// Nhập dữ liệu từ Firebase (nếu có)
				if (dataStored['fixed-periods-para'].length > 0) {
					dataStored['fixed-periods-para'].forEach((obj: IFixedPeriodObject) => {
						const existingIndex = tmpEditingObjects.findIndex(
							(item) =>
								item.subjectId === obj['subject-id'] &&
								item.classId === obj['class-id']
						);
						if (existingIndex !== -1) {
							if (maxSlot < tmpEditingObjects[existingIndex].totalSlotPerWeek) {
								setMaxSlot(tmpEditingObjects[existingIndex].totalSlotPerWeek);
							}
							tmpEditingObjects[existingIndex].slots.push(obj['start-at']);
						}
					});
				}

				if (tmpEditingObjects.length > 0) {
					setEditingObjects(tmpEditingObjects);
				} else {
					useNotify({
						message: 'Lỗi truy vấn dữ liệu phân công, vui lòng quay lại kiểm tra',
						type: 'error',
					});
				}
			}
		}
	}, [assignmentData, subjectData, teacherData, classData, dataStored, timetableStored]);

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
						<TeachersLessonsTable
							data={editingObjects}
							maxSlot={maxSlot}
							homeroomTeacher={selectedHomeroom}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
