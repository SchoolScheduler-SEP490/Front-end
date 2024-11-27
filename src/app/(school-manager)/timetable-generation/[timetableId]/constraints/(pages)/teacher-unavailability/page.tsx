'use client';

import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { useAppContext } from '@/context/app_provider';
import { ITimetableGenerationState, updateDataStored } from '@/context/slice_timetable_generation';
import useFilterArray from '@/hooks/useFilterArray';
import useNotify from '@/hooks/useNotify';
import { IConfigurationStoreObject, INoAssignPeriodObject } from '@/utils/constants';
import { firestore } from '@/utils/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TeacherUnavailableResult from './_components/teacher_unavailable_result';
import TeacherUnavailableSelector from './_components/teacher_unavailable_selector';
import useFetchTeacher from './_hooks/useFetchTeacher';
import {
	IFilterableDropdownOption,
	ITeacherResponse,
	ITeacherUnavailability,
} from './_libs/constants';

export default function TeacherUnavailability() {
	const { schoolId, sessionToken } = useAppContext();
	const { dataStored, dataFirestoreName }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);
	const dispatch = useDispatch();

	const [selectedTeacherIds, setSelectedTeacherIds] = useState<number[]>([]);
	const [selectedCells, setSelectedCells] = useState<{ [key: number]: { selected: boolean } }>(
		{}
	);
	const [teacherOptions, setTeacherOptions] = useState<IFilterableDropdownOption<number>[]>([]);
	const [departmentOptions, setDepartmentOptions] = useState<IDropdownOption<number>[]>([]);

	const [results, setResults] = useState<ITeacherUnavailability[]>([]);
	const [isResultLoading, setIsResultLoading] = useState<boolean>(true);

	const { data: teacherData, mutate: updateTeacher } = useFetchTeacher({
		schoolId,
		sessionToken,
		pageIndex: 1,
		pageSize: 1000,
	});

	const hadnleClearData = () => {
		setSelectedTeacherIds([]);
		setSelectedCells({});
	};

	const handleUpdateResults = async () => {
		const tmpSelectedSlotIds: Set<number> = new Set<number>([]);
		Object.entries(selectedCells).forEach(([key, value]) => {
			if (value.selected) {
				tmpSelectedSlotIds.add(Number(key));
			} else {
				tmpSelectedSlotIds.delete(Number(key));
			}
		});
		const tmpResults: INoAssignPeriodObject[] = [];
		selectedTeacherIds.forEach((teacherId) => {
			tmpSelectedSlotIds.forEach((slotId) => {
				tmpResults.push({
					'teacher-id': teacherId,
					'start-at': slotId,
				} as INoAssignPeriodObject);
			});
		});
		if (dataStored && dataFirestoreName && dataStored.id) {
			const docRef = doc(firestore, dataFirestoreName, dataStored.id);
			const newResults: INoAssignPeriodObject[] = useFilterArray(
				[...dataStored['no-assign-periods-para'], ...tmpResults],
				['teacher-id', 'start-at']
			);
			await setDoc(
				docRef,
				{
					...dataStored,
					'no-assign-periods-para': newResults,
				} as IConfigurationStoreObject,
				{ merge: true }
			);
			dispatch(
				updateDataStored({
					target: 'no-assign-periods-para',
					value: newResults,
				})
			);
			useNotify({
				message: 'Cập nhật cấu hình chung thành công',
				type: 'success',
			});
			hadnleClearData();
		}
	};

	const handleDelete = async (id: number) => {
		if (dataStored && dataFirestoreName && dataStored.id) {
			const newResults = dataStored['no-assign-periods-para'].filter(
				(teacher: INoAssignPeriodObject) => teacher['teacher-id'] !== id
			);
			const docRef = doc(firestore, dataFirestoreName, dataStored.id);
			await setDoc(
				docRef,
				{
					...dataStored,
					'no-assign-periods-para': newResults,
				} as IConfigurationStoreObject,
				{ merge: true }
			);
			dispatch(
				updateDataStored({
					target: 'no-assign-periods-para',
					value: newResults,
				})
			);
			hadnleClearData();
			useNotify({
				message: 'Xóa thành công',
				type: 'success',
			});
		}
	};

	const handleSelectResult = (teacherId: number) => {
		hadnleClearData();
		const tmpSelectedCells: { [key: string]: { selected: boolean } } = {};
		dataStored['no-assign-periods-para']
			.filter((teacher: INoAssignPeriodObject) => teacher['teacher-id'] === teacherId)
			.map((teacher: INoAssignPeriodObject) => {
				tmpSelectedCells[teacher['start-at']] = { selected: true };
			});
		setSelectedCells(tmpSelectedCells);
		setSelectedTeacherIds([teacherId]);
	};

	useEffect(() => {
		setTeacherOptions([]);
		setResults([]);
		setIsResultLoading(true);
		updateTeacher();
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

			if (dataStored && dataStored?.id && dataFirestoreName) {
				const tmpResults: ITeacherUnavailability[] = [];
				dataStored['no-assign-periods-para'].map((item) => {
					const existingTeacher = teacherData.result.items.find(
						(teacher: ITeacherResponse) => teacher.id === item['teacher-id']
					);
					if (existingTeacher) {
						tmpResults.push({
							...item,
							teacherObject: existingTeacher,
						} as ITeacherUnavailability);
					}
				});
				if (tmpResults.length > 0) {
					setResults(useFilterArray(tmpResults, ['teacher-id']));
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
				selectedCells={selectedCells}
				setSelectedCells={setSelectedCells}
				handleUpdateResults={handleUpdateResults}
			/>
			<TeacherUnavailableResult
				data={results}
				isLoading={isResultLoading}
				handleDelete={handleDelete}
				handleSelectResult={handleSelectResult}
			/>
		</div>
	);
}
