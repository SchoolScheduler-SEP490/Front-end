'use client';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { useAppContext } from '@/context/app_provider';
import { ITimetableGenerationState, updateDataStored } from '@/context/slice_timetable_generation';
import useFilterArray from '@/hooks/useFilterArray';
import useNotify from '@/hooks/useNotify';
import { CLASSGROUP_STRING_TYPE, CLASSGROUP_TRANSLATOR_REVERSED } from '@/utils/constants';
import { firestore } from '@/utils/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EClassSession, IClassCombinationObject } from '../../_libs/constants';
import ClassCombinationResult from './_components/class_combination_result';
import ClassCombinationSelector from './_components/class_combination_selector';
import useFetchClassCombinations from './_hook/useFetchClassCombinations';
import useFetchClassData from './_hook/useFetchClasses';
import useFetchSubjects from './_hook/useFetchSubjects';
import useFetchTeachableTeachers from './_hook/useFetchTeachableTeachers';
import {
	IClassCombinationResponse,
	IClassResponse,
	IExtendedClassCombination,
	ISubjectResponse,
	ITeachableResponse,
	ITeacherResponse,
} from './_libs/constants';
import useFetchTeacher from './_hook/useFetchTeacher';

interface ClassCombinationProps {
	// classData: ITeachingAssignmentSidenavData[];
}

const ClassCombination = (props: ClassCombinationProps) => {
	const { schoolId, selectedSchoolYearId, sessionToken } = useAppContext();
	const { dataStored, fireStoreName }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);
	const dispatch = useDispatch();

	const [results, setResults] = useState<IExtendedClassCombination[]>([]);

	const [teachableOptions, setTeachableOptions] = useState<IDropdownOption<number>[]>([]);
	const [availableClasses, setAvailabeClasses] = useState<IClassResponse[]>([]);
	const [subjectOptions, setSubjectOptions] = useState<IDropdownOption<number>[]>([]);
	const [gradeOptions, setGradeOptions] = useState<IDropdownOption<number>[]>([]);
	const [sessionOptions, setSessionOptions] = useState<IDropdownOption<string>[]>([]);

	const [selectedSubjectId, setSelectedSubjectId] = useState<number>(0);
	const [selectedGradeId, setSelectedGradeId] = useState<number>(0);
	const [selectedMainSession, setSelectedMainSession] = useState<string>('');
	const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);

	const [isResultLoading, setIsResultLoading] = useState<boolean>(true);
	const [selectedResultRow, setSelectedResultRow] = useState<IExtendedClassCombination | null>(
		null
	);

	const { data: subjectData, mutate: updateSubject } = useFetchSubjects({
		sessionToken,
		schoolYearId: selectedSchoolYearId,
		pageIndex: 1,
		pageSize: 1000,
		deletedIncluded: false,
	});
	const {
		data: classCombinationData,
		mutate: updateClassCombination,
		isValidating: isClassCombinationValidating,
	} = useFetchClassCombinations({
		sessionToken,
		schoolId,
		subjectId: selectedSubjectId,
		schoolYearId: selectedSchoolYearId,
		session: selectedMainSession.toString(),
		grade: CLASSGROUP_TRANSLATOR_REVERSED[selectedGradeId],
	});
	const { data: classData, mutate: updateClass } = useFetchClassData({
		sessionToken,
		schoolId,
		pageIndex: 1,
		pageSize: 1000,
		schoolYearId: selectedSchoolYearId,
	});
	const { data: teachableData, mutate: updateTeachable } = useFetchTeachableTeachers({
		schoolId: Number(schoolId),
		sessionToken,
		subjectId: selectedResultRow?.['subject-id'] ?? 0,
	});
	const { data: teacherData, mutate: updateTeacher } = useFetchTeacher({
		pageIndex: 1,
		pageSize: 1000,
		schoolId,
		sessionToken,
	});

	useEffect(() => {
		updateTeachable();
		setTeachableOptions([]);
		if (teachableData?.status === 200) {
			const tmpTeachableOptions: IDropdownOption<number>[] = teachableData.result.map(
				(teachable: ITeachableResponse) =>
					({
						label: `${teachable['teacher-name']} (${teachable['teacher-abreviation']})`,
						value: teachable['teacher-id'],
					} as IDropdownOption<number>)
			);
			if (tmpTeachableOptions.length > 0) {
				setTeachableOptions(tmpTeachableOptions);
			}
		}
	}, [teachableData, selectedResultRow]);

	useEffect(() => {
		setAvailabeClasses([]);
		updateClassCombination();
		if (classCombinationData?.status === 200 && classData?.status === 200) {
			if (classCombinationData.result !== null) {
				const tmpAvailableClasses: IClassResponse[] = classData.result.items.filter(
					(item: IClassResponse) =>
						classCombinationData.result.some(
							(clazz: IClassCombinationResponse) => clazz.id === item.id
						)
				);
				if (tmpAvailableClasses.length > 0) {
					setAvailabeClasses(tmpAvailableClasses);
				}
			} else {
				useNotify({
					message: 'Không tìm thấy lớp có thể gộp cho môn học',
					type: 'error',
				});
			}
		}
	}, [selectedGradeId, selectedMainSession, selectedSubjectId, classCombinationData, classData]);

	useEffect(() => {
		updateSubject();
		if (subjectData?.status === 200) {
			const tmpSubjectOptions: IDropdownOption<number>[] = subjectData.result.items.map(
				(item: ISubjectResponse) =>
					({
						label: `${item['subject-name']} (${item.abbreviation})`,
						value: item.id,
					} as IDropdownOption<number>)
			);
			if (tmpSubjectOptions.length > 0) {
				setSubjectOptions(useFilterArray(tmpSubjectOptions, ['value']));
			}
		}
		const tmpGradeOptions = CLASSGROUP_STRING_TYPE.map(
			(item) =>
				({
					label: item.key,
					value: item.value,
				} as IDropdownOption<number>)
		);
		setGradeOptions(tmpGradeOptions);
		const sessionOptions = [
			{ label: 'Sáng', value: EClassSession.Morning },
			{ label: 'Chiều', value: EClassSession.Afternoon },
		];
		setSessionOptions(sessionOptions);
	}, [subjectData]);

	useEffect(() => {
		setResults([]);
		setIsResultLoading(true);
		setSelectedResultRow(null);
		updateClass();
		updateTeacher();
		if (
			dataStored &&
			dataStored['class-combinations']?.length > 0 &&
			classData?.status === 200 &&
			teacherData?.status === 200
		) {
			const tmpResults: IClassCombinationObject[] = [...dataStored['class-combinations']];
			const tmpExtendedResults: IExtendedClassCombination[] = tmpResults.map((item) => {
				const classNames: string[] = classData.result.items
					.filter((clazz: IClassResponse) => item['class-ids'].includes(clazz.id))
					.map((clazz: IClassResponse) => clazz.name);
				const subjectName: string =
					subjectOptions.find((option) => option.value === item['subject-id'])?.label ||
					'';
				const teacher: ITeacherResponse | undefined = teacherData.result.items.find(
					(teacher: ITeacherResponse) => teacher.id === (item['teacher-id'] || 0)
				);
				return {
					...item,
					'class-names': classNames,
					'subject-name': subjectName,
					'teacher-name': teacher
						? ({
								label: `${teacher?.['first-name']} ${teacher?.['last-name']} (${teacher?.abbreviation})`,
								value: teacher?.id || 0,
						  } as IDropdownOption<number>)
						: { label: '- - -', value: 0 },
				} as IExtendedClassCombination;
			});
			setResults(tmpExtendedResults);
			setIsResultLoading(false);
		}
	}, [dataStored, classData, teacherData]);

	// Lưu thay đổi lên Firebase
	const handleSaveChanges = async () => {
		if (dataStored && fireStoreName && dataStored.id) {
			const newResults = [
				...results,
				{
					'class-ids': selectedClassIds,
					'subject-id': selectedSubjectId,
					'teacher-id': null,
					session: selectedMainSession,
				} as IClassCombinationObject,
			];
			const docRef = doc(firestore, fireStoreName, dataStored.id);
			await setDoc(docRef, {
				...dataStored,
				'class-combinations': newResults,
			});
			dispatch(updateDataStored({ target: 'class-combinations', value: newResults }));
			useNotify({ message: 'Lưu thay đổi thành công', type: 'success' });

			handleDiscardChanges();
		}
	};

	const handleAssignTeacher = async (teacherId: number) => {
		if (dataStored && fireStoreName && dataStored.id) {
			const newResults = results.map((item) => {
				if (
					item['subject-id'] === selectedResultRow?.['subject-id'] &&
					item['class-ids'] === selectedResultRow?.['class-ids']
				) {
					return {
						...item,
						'teacher-id': teacherId,
					};
				}
				return item;
			});
			const docRef = doc(firestore, fireStoreName, dataStored.id);
			await setDoc(docRef, {
				...dataStored,
				'class-combinations': newResults,
			});
			dispatch(updateDataStored({ target: 'class-combinations', value: newResults }));
		}
	};

	const handleDeleteClassCombination = async () => {
		if (dataStored && fireStoreName && dataStored.id) {
			const newResults = results.filter(
				(item) =>
					item['subject-id'] !== selectedResultRow?.['subject-id'] &&
					item['class-ids'] !== selectedResultRow?.['class-ids']
			);
			const docRef = doc(firestore, fireStoreName, dataStored.id);
			await setDoc(docRef, {
				...dataStored,
				'class-combinations': newResults,
			});
			dispatch(updateDataStored({ target: 'class-combinations', value: newResults }));
		}
	};

	// Huỷ thay đổi
	const handleDiscardChanges = () => {
		setSelectedClassIds([]);
	};

	return (
		<div className='w-full h-full flex flex-row justify-between items-center'>
			<ClassCombinationSelector
				subjectOptions={subjectOptions}
				gradeOptions={gradeOptions}
				sessionOptions={sessionOptions}
				classOptions={availableClasses}
				selectedGradeId={selectedGradeId}
				selectedMainSession={selectedMainSession}
				selectedSubjectId={selectedSubjectId}
				setSelectedGradeId={setSelectedGradeId}
				setSelectedMainSession={setSelectedMainSession}
				setSelectedSubjectId={setSelectedSubjectId}
				isLoading={isClassCombinationValidating}
				selectedClassIds={selectedClassIds}
				setSelectedClassIds={setSelectedClassIds}
				handleSavechanges={handleSaveChanges}
				handleDiscardChanges={handleDiscardChanges}
			/>
			<ClassCombinationResult
				classCombinations={results}
				teacherOptions={teachableOptions}
				selectedRow={selectedResultRow}
				setSelectedRow={setSelectedResultRow}
				setTeacherOptions={setTeachableOptions}
				handleAssignTeacher={handleAssignTeacher}
				handleDeleteClassCombination={handleDeleteClassCombination}
				isLoading={isResultLoading}
			/>
		</div>
	);
};

export default ClassCombination;
