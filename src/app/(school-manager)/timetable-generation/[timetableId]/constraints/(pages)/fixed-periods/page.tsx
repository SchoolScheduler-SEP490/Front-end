'use client';

import { useAppContext } from '@/context/app_provider';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import { useDispatch, useSelector } from 'react-redux';
import useFetchClasses from './_hooks/useFetchClass';
import { useEffect, useState } from 'react';
import { IAssignmentResponse, IClassResponse, IExtendedFixedPeriod } from './_libs/constants';
import useFetchTeachingAssignment from './_hooks/useFetchTeachingAssignment';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { IFixedPeriodObject, ITeachingAssignmentObject } from '@/utils/constants';

export default function FixedPeriodsPage() {
	const { schoolId, sessionToken } = useAppContext();
	const { dataStored, dataFirestoreName, timetableStored }: ITimetableGenerationState =
		useSelector((state: any) => state.timetableGeneration);
	const dispatch = useDispatch();

	const [selectedGrade, setSelectedGrade] = useState<string>('');
	const [selectedClassId, setSelectedClassId] = useState<number>(0);

	const [results, setResults] = useState<IExtendedFixedPeriod[]>([]);
	const [classOptions, setClassOptions] = useState<IDropdownOption<number>[]>([]);
	const [teacherOptions, setTeacherOptions] = useState<IDropdownOption<number>[]>([]);

	const {
		data: classData,
		mutate: updateClass,
		isValidating: isClassValidating,
	} = useFetchClasses({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
		schoolYearId: timetableStored['year-id'],
		grade: selectedGrade,
	});
	const {
		data: teachingAssignmentData,
		mutate: updateTeachingAssignment,
		isValidating: isTeachingAssignmentValidating,
	} = useFetchTeachingAssignment({
		sessionToken,
		schoolId: Number(schoolId),
		schoolYearId: timetableStored['year-id'] ?? 0,
		termId: timetableStored['term-id'] ?? 0,
		studentClassId: selectedClassId,
	});

	useEffect(() => {
		setClassOptions([]);
		updateClass();
		if (classData?.status === 200) {
			const tmpClassOptions = classData.result.items.map(
				(clazz: IClassResponse) =>
					({
						label: clazz.name,
						value: clazz.id,
					} as IDropdownOption<number>)
			);
			if (tmpClassOptions.length > 0) {
				setClassOptions(tmpClassOptions);
			}
		}
	}, [classData]);

	useEffect(() => {
		setTeacherOptions([]);
		updateTeachingAssignment();
		if (teachingAssignmentData?.status === 200) {
			const availableTeachers: IAssignmentResponse[] = [
				...teachingAssignmentData.result['teacher-assignt-view'],
				...teachingAssignmentData.result['teacher-not-assignt-view'],
			];
			if (availableTeachers.length > 0) {
				const tmpTeacherOptions: IDropdownOption<number>[] = [];
				availableTeachers.map((assignment: IAssignmentResponse) => {
					if (
						dataStored['teacher-assignments'].some(
							(item: ITeachingAssignmentObject) =>
								item['teacher-id'] === assignment['teacher-id']
						)
					) {
						tmpTeacherOptions.push({
							label: `${assignment['teacher-last-name']} ${assignment['teacher-first-name']} (${assignment['teacher-abbreviation']})`,
							value: assignment['teacher-id'],
						} as IDropdownOption<number>);
					}
				});
				if (tmpTeacherOptions.length > 0) {
					setTeacherOptions(tmpTeacherOptions);
				}
			}
		}
	}, [teachingAssignmentData, selectedClassId]);

	useEffect(() => {
		setResults([]);
		if (dataStored && teachingAssignmentData?.status === 200 && classOptions.length > 0) {
			const tmpResultObjects: IExtendedFixedPeriod[] = [];
			const availableTeachers: IAssignmentResponse[] = [
				...teachingAssignmentData.result['teacher-assignt-view'],
				...teachingAssignmentData.result['teacher-not-assignt-view'],
			];
			if (availableTeachers.length > 0) {
				dataStored['fixed-periods-para'].map((obj: IFixedPeriodObject) => {
					const existingAssignment = availableTeachers.find(
						(assignment: IAssignmentResponse) =>
							assignment['subject-id'] === obj['subject-id']
					);
					const existingClass = classOptions.find(
						(clazz: IDropdownOption<number>) => clazz.value === obj['class-id']
					);
					if (existingAssignment && existingClass) {
						tmpResultObjects.push({
							...obj,
							subjectName: existingAssignment['subject-name'],
							className: existingClass.label,
							teacherName: `${existingAssignment['teacher-last-name']} ${existingAssignment['teacher-first-name']} (${existingAssignment['teacher-abbreviation']})`,
							teacherId: existingAssignment['teacher-id'],
						} as IExtendedFixedPeriod);
					}
				});
				if (tmpResultObjects.length > 0) {
					setResults(tmpResultObjects);
				}
			}
		}
	}, [dataStored, teachingAssignmentData]);

	return <div className='w-full h-full flex flex-row justify-between items-center'></div>;
}
