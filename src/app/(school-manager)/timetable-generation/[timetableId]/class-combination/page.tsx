'use client';
import { useAppContext } from '@/context/app_provider';
import { ITimetableGenerationState, updateDataStored } from '@/context/slice_timetable_generation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IClassResponse } from './_libs/constants';
import useFetchClassData from './_hook/useFetchClasses';
import { EClassSession, IClassCombinationObject } from '../../_libs/constants';
import useFilterArray from '@/hooks/useFilterArray';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/utils/firebaseConfig';

interface ClassCombinationProps {
	// classData: ITeachingAssignmentSidenavData[];
}

const ClassCombination = (props: ClassCombinationProps) => {
	const { schoolId, selectedSchoolYearId, sessionToken } = useAppContext();
	const { dataStored, fireStoreName }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);
	const dispatch = useDispatch();

	const [availableClasses, setAvailabeClasses] = useState<IClassResponse[]>([]);
	const [subjectOptions, setSubjectOptions] = useState<IDropdownOption<number>[]>([]);
	const [gradeOptions, setGradeOptions] = useState<IDropdownOption<number>[]>([]); //Consider using generated static value instead
	const [results, setResults] = useState<IClassCombinationObject[]>([]);

	const [selectedSubjectId, setSelectedSubjectId] = useState<number>(0);
	const [selectedGradeId, setSelectedGradeId] = useState<number>(0);
	const [selectedMainSession, setSelectedMainSession] = useState<EClassSession>(
		EClassSession.Morning
	);

	// Cập nhật thay đổi dưới local
	const handleUpdateResult = () => {
		dispatch(updateDataStored({ target: 'class-combinations', value: results }));
	};

	// Lưu thay đổi lên Firebase
	const handleSaveChange = async () => {
		if (dataStored && fireStoreName && dataStored.id) {
			const docRef = doc(firestore, fireStoreName, dataStored.id);
			await setDoc(docRef, {
				'class-combinations': results,
			});
		}
	};

	const { data, mutate } = useFetchClassData({
		pageIndex: 1,
		pageSize: 100,
		schoolId,
		schoolYearId: selectedSchoolYearId,
		sessionToken,
	});

	useEffect(() => {
		if (dataStored && dataStored['class-combinations']?.length > 0) {
			const tmpResults: IClassCombinationObject[] = useFilterArray(
				[...results, ...dataStored['class-combinations']],
				['subject-id', 'class-ids']
			);
			setResults(tmpResults);
		}
	}, [dataStored]);

	useEffect(() => {
		if (data?.status === 200) {
			// const tmpClassData: IClassResponse[] = data.result.items.filter((class: IClassResponse) => class['main-session'] )
			// if (tmpClassData.length > 0) {
			// 	setClassTableData(tmpClassData);
			// }
		}
	}, [data, selectedSubjectId]);

	return (
		<div className='w-full h-full flex flex-row justify-between items-center'>
			{/* Add components here */}
		</div>
	);
};

export default ClassCombination;
