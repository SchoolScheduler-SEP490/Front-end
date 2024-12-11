'use client';
import { useAppContext } from '@/context/app_provider';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import useNotify from '@/hooks/useNotify';
import { IFixedPeriodObject, ITeachingAssignmentObject } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TeachersLessonsSideNav from './_components/teachers_lessons_sidenav';
import TeachersLessonsTable from './_components/teachers_lessons_table';
import useFetchClassData from './_hooks/useFetchClass';
import useFetchClassCombination from './_hooks/useFetchClassCombination';
import useFetchCurriculumDetails from './_hooks/useFetchCurriculumDetails';
import useFetchSubject from './_hooks/useFetchSubject';
import useFetchTeacher from './_hooks/useFetchTeacher';
import useFetchTeachingAssignment from './_hooks/useFetchTeachingAssignment';
import useSidenavDataConverter from './_hooks/useSidenavDataConverter';
import {
	IAssignmentResponse,
	IClassCombinationResponse,
	IClassResponse,
	ISubjectInGroup,
	ISubjectResponse,
	ITeacherResponse,
	ITeachersLessonsObject,
	ITeachersLessonsSidenavData,
} from './_libs/constants';
import useFilterArray from '@/hooks/useFilterArray';

export default function TeachersLessons() {
	const { selectedSchoolYearId, schoolId, sessionToken } = useAppContext();
	const { timetableStored, dataStored }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);

	const [selectedGrade, setSelectedGrade] = useState<string>('');
	const [selectedClassId, setSelectedClassId] = useState<number>(0);
	const [selectedHomeroom, setSelectedHomeroom] = useState<string>('');
	const [selectedMainSesion, setSelectedMainSesion] = useState<number>(0);
	const [selectedCurriculumId, setSelectedCurriculumId] = useState<number>(0);
	const [maxSlot, setMaxSlot] = useState<number>(5);

	// Data của clascombination
	const [selectedCombinationId, setSelectedCombinationId] = useState<number>(0);
	const [isCombinationClass, setIsCombinationClass] = useState<boolean>(false);

	const [editingObjects, setEditingObjects] = useState<ITeachersLessonsObject[]>([]);
	const [sidenavData, setSidenavData] = useState<ITeachersLessonsSidenavData[]>([]);
	const [classCombinationData, setClassCombinationData] = useState<IClassCombinationResponse[]>([]);

	const { data: teacherData, mutate: updateTeacher } = useFetchTeacher({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
	});

	const { data: classData, mutate: updateClass } = useFetchClassData({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
		schoolYearId: selectedSchoolYearId,
	});

	const { data: subjectData, mutate: updateSubject } = useFetchSubject({
		sessionToken,
		schoolYearId: selectedSchoolYearId,
		pageSize: 100,
		pageIndex: 1,
	});

	const { data: assignmentData, mutate: updateAssignment } = useFetchTeachingAssignment({
		sessionToken,
		schoolId: Number(schoolId),
		schoolYearId: selectedSchoolYearId,
		studentClassId: selectedClassId,
		termId: timetableStored['term-id'] ?? 0,
	});

	const { data: curriculumData, mutate: updateCurriculum } = useFetchCurriculumDetails({
		sessionToken,
		schoolId: Number(schoolId),
		schoolYearId: timetableStored['year-id'],
		curriculumId: selectedCurriculumId,
	});

	const { data: classCombinationResponse, mutate: updateClassCombination } =
		useFetchClassCombination({
			schoolId: schoolId,
			sessionToken,
			pageIndex: 1,
			pageSize: 1000,
			termId: timetableStored['term-id'],
		});

	useEffect(() => {
		updateSubject();
		if (selectedCombinationId !== 0 && subjectData?.status === 200) {
			setEditingObjects([]);
			const currentCombination: IClassCombinationResponse | undefined = classCombinationData.find(
				(combination) => combination.id === selectedCombinationId
			);
			const currentSubject: ISubjectResponse | undefined = subjectData.result.items.find(
				(subject: ISubjectResponse) => subject.id === currentCombination?.['subject-id']
			);
			if (currentCombination !== undefined && currentSubject !== undefined) {
				const tmpRes: ITeachersLessonsObject = {
					classId: 0,
					teacherId: currentCombination['teacher-id'],
					teacherName: currentCombination['teacher-abbreviation'],
					slots:
						dataStored['fixed-periods-para']?.length > 0
							? useFilterArray(
									dataStored['fixed-periods-para'].filter(
										(item) =>
											item['is-combination'] === true &&
											item['teacher-id'] === currentCombination['teacher-id']
									),
									['teacher-id', 'start-at']
							  )
									.map((item) => item['start-at'])
									.sort((a, b) => a - b)
							: [],
					subjectId: currentCombination['subject-id'],
					subjectName: currentSubject['subject-name'],
					subjectAbbreviation: currentSubject.abbreviation,
					totalSlotPerWeek: currentCombination['slot-per-week'],
					totalMainSlotsPerWeek: currentCombination['slot-per-week'],
					totalSubSlotsPerWeek: 0,
					isDoubleSlot:
						currentCombination['slot-per-week'] >= 2 &&
						currentCombination['slot-per-week'] % 2 === 0,
					minimumMainCouple: 0,
					minimumSubCouple: 0,
					className: currentCombination['e-grade'],
					appliedClass: currentCombination['student-class'].map(
						(clazz) =>
							({
								id: clazz.id,
								name: clazz['student-class-name'],
							} as { id: number; name: string })
					),
				} as ITeachersLessonsObject;
				setEditingObjects((prev) => [...prev, tmpRes]);
				setSelectedHomeroom(
					`${currentCombination['e-grade']}|${currentCombination['student-class']
						.map((clazz) => clazz['student-class-name'])
						.join(',')}`
				);
				setSelectedMainSesion(currentCombination.session === 'Morning' ? 0 : 1);
				setIsCombinationClass(true);
			}
		}
	}, [selectedCombinationId, classCombinationData, subjectData, dataStored]);

	useEffect(() => {
		updateClassCombination();
		if (classCombinationResponse?.status === 200) {
			setClassCombinationData(classCombinationResponse.result.items);
			// setSelectedCombinationId(classCombinationResponse.result.items[0].id);
		}
	}, [classCombinationResponse]);

	useEffect(() => {
		setSelectedHomeroom('');
		updateAssignment();
		updateCurriculum();
		updateTeacher();
		updateClass();
		if (
			assignmentData?.status === 200 &&
			classData?.status === 200 &&
			teacherData?.status === 200 &&
			dataStored
		) {
			setEditingObjects([]);
			const selectedClass: IClassResponse | undefined = classData.result.items.find(
				(item: IClassResponse) => item.id === selectedClassId
			);
			if (selectedClass) {
				setSelectedHomeroom(selectedClass['homeroom-teacher-abbreviation']);
				setSelectedMainSesion(Math.abs(selectedClass['main-session'] - 1));
				setSelectedCurriculumId(selectedClass['curriculum-id'] ?? 0);
			}
			const tmpEditingObjects: ITeachersLessonsObject[] = [];
			const availableSubjects: IAssignmentResponse[] = [
				...assignmentData.result['teacher-assignt-view'],
				...assignmentData.result['teacher-not-assignt-view'],
			];
			let availableCurriculumSubjects: ISubjectInGroup[] = [];
			if (curriculumData?.status === 200) {
				availableCurriculumSubjects = [
					...curriculumData.result['subject-selective-views'],
					...curriculumData.result['subject-specializedt-views'],
					...curriculumData.result['subject-required-views'],
				];
			}
			if (availableSubjects.length > 0 && availableCurriculumSubjects.length > 0) {
				// Duyệt toàn bộ môn học để lấy dữ liệu assign cơ bản
				availableSubjects.forEach((assignment: IAssignmentResponse) => {
					const assignedTeacher: ITeachingAssignmentObject | undefined = dataStored[
						'teacher-assignments'
					].find((item) => item['assignment-id'] === assignment.id);

					const availableTeacher: ITeacherResponse | undefined = teacherData.result.items.find(
						(teacher: ITeacherResponse) => teacher.id === assignedTeacher?.['teacher-id']
					);
					if (availableTeacher) {
						const subjectInCurriculum: ISubjectInGroup | undefined =
							availableCurriculumSubjects.find(
								(subjectInGroup: ISubjectInGroup) =>
									assignment['subject-id'] === subjectInGroup['subject-id']
							);
						tmpEditingObjects.push({
							classId: assignment['student-class-id'],
							teacherId: availableTeacher.id,
							teacherName: availableTeacher['abbreviation'],
							slots: [],
							subjectId: assignment['subject-id'],
							subjectName: assignment['subject-name'],
							subjectAbbreviation: subjectInCurriculum?.abbreviation ?? assignment['subject-name'],
							totalSlotPerWeek:
								(subjectInCurriculum?.['main-slot-per-week'] ?? 0) +
								(subjectInCurriculum?.['sub-slot-per-week'] ?? 0),
							totalMainSlotsPerWeek: subjectInCurriculum?.['main-slot-per-week'] ?? 0,
							totalSubSlotsPerWeek: subjectInCurriculum?.['sub-slot-per-week'] ?? 0,
							isDoubleSlot: subjectInCurriculum?.['is-double-period'] ?? false,
							minimumMainCouple: subjectInCurriculum?.['main-minimum-couple'] ?? 0,
							minimumSubCouple: subjectInCurriculum?.['sub-minimum-couple'] ?? 0,
						} as ITeachersLessonsObject);
					}
				});

				// Nhập dữ liệu từ Firebase (nếu có)
				if (dataStored['fixed-periods-para'].length > 0) {
					dataStored['fixed-periods-para'].forEach((obj: IFixedPeriodObject) => {
						const existingIndex = tmpEditingObjects.findIndex(
							(item) => item.subjectId === obj['subject-id'] && item.classId === obj['class-id']
						);
						if (existingIndex !== -1) {
							if (maxSlot < tmpEditingObjects[existingIndex].totalSlotPerWeek) {
								setMaxSlot(tmpEditingObjects[existingIndex].totalSlotPerWeek);
							}
							tmpEditingObjects[existingIndex].slots.push(obj['start-at']);
						}
						if (
							tmpEditingObjects[existingIndex]?.slots &&
							tmpEditingObjects[existingIndex].slots.length > 0
						) {
							tmpEditingObjects[existingIndex].slots.sort((a, b) => a - b);
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
	}, [assignmentData, teacherData, classData, dataStored, timetableStored, curriculumData]);

	// Lấy data cho sidenav
	useEffect(() => {
		updateClass();
		if (classData?.status === 200) {
			const tmpData: ITeachersLessonsSidenavData[] = useSidenavDataConverter(
				classData.result.items as IClassResponse[]
			);
			if (tmpData.length > 0) {
				setSidenavData(tmpData);
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
					classCombinationData={classCombinationData}
					selectedCombination={selectedCombinationId}
					setIsCombinationClass={setIsCombinationClass}
					setSelectedCombination={setSelectedCombinationId}
				/>
				<div className='w-[85%] h-full flex justify-center items-start gap-5'>
					<div className='w-full h-[85vh] pt-[5vh] px-[5vw] overflow-y-scroll no-scrollbar'>
						<TeachersLessonsTable
							data={editingObjects}
							maxSlot={maxSlot}
							homeroomTeacher={selectedHomeroom}
							mainSession={selectedMainSesion}
							isCombinationClass={isCombinationClass}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
