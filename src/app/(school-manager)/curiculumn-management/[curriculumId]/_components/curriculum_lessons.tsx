'use client';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { useAppContext } from '@/context/app_provider';
import useFetchTerm from '@/hooks/useFetchTerm';
import useFilterArray from '@/hooks/useFilterArray';
import useNotify from '@/hooks/useNotify';
import { ITermResponse } from '@/utils/constants';
import { TRANSLATOR } from '@/utils/dictionary';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useFetchCurriculumTableData from '../_hooks/useFetchCuriculumnTableData';
import { ILessonTableData, ISubjectInGroup } from '../_libs/constants';
import LessonTable from './lessons/lesson_table';
import LessonTableSkeleton from './lessons/skeleton_table';

const CurriculumLesson = () => {
	const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
	const curriculumId = useParams().curriculumId;

	const [selectedTermId, setSelectedTermId] = useState<number>(0);
	const [selectedCurriculumName, setSelectedCurriculumName] = useState<string>('');

	const [lessonTableData, setLessonTableData] = useState<ILessonTableData[]>([]);
	const [termDropdownData, setTermDropdownData] = useState<IDropdownOption<number>[]>([]);

	const [isErrorShown, setIsErrorShown] = useState<boolean>(false);

	const {
		data: curriculumDataResponse,
		error: subjectTableError,
		isValidating: isCurriculumTableValidating,
		mutate: updateCurriculumTable,
	} = useFetchCurriculumTableData({
		sessionToken: sessionToken,
		schoolId: Number(schoolId),
		schoolYearId: selectedSchoolYearId,
		subjectGroupId: Number(curriculumId as string),
	});
	const {
		data: termData,
		error: termError,
		mutate: updateTerm,
		isValidating: isTermValidating,
	} = useFetchTerm({
		pageIndex: 1,
		pageSize: 100,
		schoolYearId: selectedSchoolYearId,
	});

	useEffect(() => {
		setLessonTableData([]);
		updateCurriculumTable();
		if (curriculumDataResponse?.status === 200) {
			setSelectedCurriculumName(curriculumDataResponse.result['curriculum-name']);
			var tmpSpecializedData: { name: string; id: number }[] = [];
			curriculumDataResponse.result['subject-specializedt-views'].map((item: ISubjectInGroup) => {
				if (item['term-id'] === selectedTermId)
					tmpSpecializedData.push({
						name: item['subject-name'],
						id: item.id,
					});
			});
			var tmpSelectiveData: ILessonTableData[] = [];
			curriculumDataResponse.result['subject-selective-views'].map((item: ISubjectInGroup) => {
				if (item['term-id'] === selectedTermId) {
					tmpSelectiveData.push({
						id: item.id,
						lessonName: item['subject-name'],
						mainTotalSlotPerWeek: item['main-slot-per-week'],
						isDouleSlot: item['is-double-period'],
						subTotalSlotPerWeek: item['sub-slot-per-week'],
						subIsDouleSlot: item['main-slot-per-week'],
						isRequiredSubject: item['is-required'],
						isSpecializedSubject: tmpSpecializedData?.some((spec) => spec?.id === item.id) ?? false,
						mainMinimumCouple: 0,
						subMinimumCouple: 0,
						slotPerTerm: item['slot-per-term'],
					} as ILessonTableData);
				}
			});
			var tmpRequiredData: ILessonTableData[] = [];
			curriculumDataResponse.result['subject-required-views'].map((item: ISubjectInGroup) => {
				if (item['term-id'] === selectedTermId) {
					tmpRequiredData.push({
						id: item.id,
						lessonName: item['subject-name'],
						mainTotalSlotPerWeek: item['main-slot-per-week'],
						isDouleSlot: item['is-double-period'],
						subTotalSlotPerWeek: item['sub-slot-per-week'],
						subIsDouleSlot: item['is-double-period'],
						isRequiredSubject: item['is-required'],
						isSpecializedSubject: tmpSpecializedData?.some((spec) => spec?.id === item.id) ?? false,
						mainMinimumCouple: item['main-minimum-couple'],
						subMinimumCouple: item['sub-minimum-couple'],
						slotPerTerm: item['slot-per-term'],
					} as ILessonTableData);
				}
			});
			const optimizedData = useFilterArray(
				[...tmpSelectiveData, ...tmpRequiredData],
				['lessonName']
			);
			setLessonTableData(optimizedData);
		}
	}, [curriculumDataResponse, selectedTermId]);

	useEffect(() => {
		updateTerm();
		if (termData?.status === 200) {
			const termStudyOptions: IDropdownOption<number>[] = termData.result.items.map(
				(item: ITermResponse) => ({
					value: item.id,
					label: `${item.name} | ${item['school-year-start']} - ${item['school-year-end']}`,
				})
			);
			setTermDropdownData(termStudyOptions);
			setSelectedTermId(termStudyOptions[0].value);
		}
	}, [termData, selectedSchoolYearId]);

	useEffect(() => {
		setTermDropdownData([]);
		setLessonTableData([]);
		setSelectedTermId(0);
		updateTerm({ schoolYearId: selectedSchoolYearId });
		updateCurriculumTable({ schoolYearId: selectedSchoolYearId });
		setIsErrorShown(false);
	}, [selectedSchoolYearId]);

	useEffect(() => {
		if (!isErrorShown) {
			if (termError) {
				useNotify({
					message: TRANSLATOR[termError?.message] ?? 'Chưa có dữ liệu môn học cho năm học',
					type: 'error',
				});
				setIsErrorShown(true);
			}
		}
	}, [isCurriculumTableValidating, isTermValidating]);

	// Loading components
	if (isCurriculumTableValidating) {
		return (
			<div
				className={`w-[100%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar`}
			>
				<LessonTableSkeleton />
			</div>
		);
	}

	return (
		<div
			className={`w-[100%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar`}
		>
			<LessonTable
				subjectTableData={lessonTableData}
				termData={termDropdownData}
				selectedTermId={selectedTermId}
				setSelectedTermId={setSelectedTermId}
				selectedCurriculumId={Number(curriculumId as string)}
				selectedCurriculumName={selectedCurriculumName}
				mutator={updateCurriculumTable}
			/>
		</div>
	);
};

export default CurriculumLesson;
