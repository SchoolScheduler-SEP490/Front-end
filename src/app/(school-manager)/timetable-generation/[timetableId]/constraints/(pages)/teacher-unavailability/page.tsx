'use client';

import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { ITeachingAssignmentObject } from '@/app/(school-manager)/timetable-generation/_libs/constants';
import { useAppContext } from '@/context/app_provider';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import useFilterArray from '@/hooks/useFilterArray';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TeacherUnavailableResult from './_components/teacher_unavailable_result';
import TeacherUnavailableSelector from './_components/teacher_unavailable_selector';
import useFetchTeacher from './_hooks/useFetchTeacher';
import {
	IExtendedTeachingAssignment,
	IFilterableDropdownOption,
	ITeacherResponse,
} from './_libs/constants';

export default function TeacherUnavailability() {
	const { schoolId, selectedSchoolYearId, sessionToken } = useAppContext();
	const { dataStored, fireStoreName }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);

	const [selectedTeacherIds, setSelectedTeacherIds] = useState<number[]>([]);
	const [teacherOptions, setTeacherOptions] = useState<IFilterableDropdownOption<number>[]>([]);
	const [departmentOptions, setDepartmentOptions] = useState<IDropdownOption<number>[]>([]);

	const [results, setResults] = useState<IExtendedTeachingAssignment[]>([]);
	const [isResultLoading, setIsResultLoading] = useState<boolean>(true);

	const { data: teacherData, mutate: updateTeacher } = useFetchTeacher({
		schoolId,
		sessionToken,
		pageIndex: 1,
		pageSize: 1000,
	});

	useEffect(() => {
		updateTeacher();
		setTeacherOptions([]);
		setResults([]);
		setIsResultLoading(true);
		if (teacherData?.status === 200) {
			var tmpTeacherOptions: IFilterableDropdownOption<number>[] = [];
			var tmpDepartmentOptions: IDropdownOption<number>[] = [];
			teacherData.result.items.map((teacher: ITeacherResponse) => {
				tmpTeacherOptions.push({
					label: `${teacher['first-name']} ${teacher['last-name']} (${teacher.abbreviation})`,
					value: teacher.id,
					filterableId: teacher['department-id'],
				} as IFilterableDropdownOption<number>);

				tmpDepartmentOptions.push({
					label: teacher['department-name'],
					value: teacher['department-id'],
				});
			});
			if (tmpTeacherOptions.length > 0) {
				setTeacherOptions(tmpTeacherOptions);
			}
			if (tmpDepartmentOptions.length > 0) {
				setDepartmentOptions(useFilterArray(tmpDepartmentOptions, ['value']));
			}

			if (dataStored && dataStored?.id && fireStoreName) {
				const tmpResults: IExtendedTeachingAssignment[] = dataStored[
					'teacher-assignments'
				].map((item: ITeachingAssignmentObject) => {
					const availableTeacher: ITeacherResponse = teacherData.result.items.find(
						(teacher: ITeacherResponse) => teacher.id === item['teacher-id']
					);
					return {
						...item,
						teacherObject: availableTeacher,
					} as IExtendedTeachingAssignment;
				});
				if (tmpResults.length > 0) {
					setResults(tmpResults);
				}
			}
			setIsResultLoading(false);
		}
	}, [teacherData, dataStored]);

	return (
		<div className='w-full h-full flex flex-row justify-between items-center'>
			<TeacherUnavailableSelector
				selectedTeacherIds={selectedTeacherIds}
				setSelectedTeacherIds={setSelectedTeacherIds}
				teacherOptions={teacherOptions}
				departmentOptions={departmentOptions}
			/>
			<TeacherUnavailableResult data={results} />
		</div>
	);
}
