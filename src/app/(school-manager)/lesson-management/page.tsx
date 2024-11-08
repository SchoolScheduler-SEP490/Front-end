'use client';
import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import useFetchTerm from '@/hooks/useFetchTerm';
import useFilterArray from '@/hooks/useFilterArray';
import useNotify from '@/hooks/useNotify';
import { ITermResponse } from '@/utils/constants';
import { TRANSLATOR } from '@/utils/dictionary';
import { useEffect, useState } from 'react';
import { IDropdownOption } from '../_utils/contants';
import SubjectGroupSideNav from './_components/lesson_sidenav';
import LessonTable from './_components/lesson_table';
import SubjectGroupSideNavSkeleton from './_components/skeleton_sidenav';
import LessonTableSkeleton from './_components/skeleton_table';
import useFetchSGTableData from './_hooks/useFetchSGTableData';
import useFetchSGSidenav from './_hooks/useFetchSubjectGroup';
import useSidenavDataConverter from './_hooks/useSidenavDataConverter';
import {
	ILessonTableData,
	ISubjectGroupObjectResponse,
	ISubjectGroupSidenavData,
	ISubjectInGroup,
} from './_libs/constants';

export default function SMLesson() {
	const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();

	const [selectedSubjectGroup, setSelectedSubjectGroup] = useState<number>(0);
	const [selectedTermId, setSelectedTermId] = useState<number>(0);
	const [subjectGroup, setSubjectGroup] = useState<ISubjectGroupSidenavData[]>([]);
	const [lessonTableData, setLessonTableData] = useState<ILessonTableData[]>([]);
	const [termDropdownData, setTermDropdownData] = useState<IDropdownOption<number>[]>([]);
	const {
		data: subjectGroupData,
		mutate: updateSubjectGroup,
		isLoading: isSubjectGroupLoading,
		isValidating: isSubjectGroupValidating,
		error: subjectGroupError,
	} = useFetchSGSidenav({
		sessionToken: sessionToken,
		schoolId: schoolId,
		pageIndex: 1,
		pageSize: 1000,
		schoolYearId: selectedSchoolYearId,
	});
	const {
		data: subjectGroupTableResponse,
		error: subjectTableError,
		isValidating: isSubjectGroupTableValidating,
		mutate: updateSubjectGroupTable,
	} = useFetchSGTableData({
		sessionToken: sessionToken,
		schoolId: Number(schoolId),
		schoolYearId: selectedSchoolYearId,
		subjectGroupId: selectedSubjectGroup,
	});
	const { data: termData } = useFetchTerm({
		pageIndex: 1,
		pageSize: 100,
		schoolYearId: selectedSchoolYearId,
	});

	useEffect(() => {
		updateSubjectGroup();
		if (subjectGroupData?.status === 200) {
			const tmpData: ISubjectGroupSidenavData[] = useSidenavDataConverter(
				subjectGroupData.result.items as ISubjectGroupObjectResponse[]
			);
			if (tmpData.length > 0) {
				setSubjectGroup(tmpData);
				setSelectedSubjectGroup(tmpData[0].items[0].value);
			}
		}
	}, [subjectGroupData]);

	useEffect(() => {
		updateSubjectGroupTable();
		if (subjectGroupTableResponse?.status === 200) {
			const tmpSelectiveData: ILessonTableData[] = subjectGroupTableResponse.result[
				'subject-selective-views'
			].map((item: ISubjectInGroup) => {
				return {
					id: item.id,
					lessonName: item['subject-name'],
					mainTotalSlotPerWeek: item['main-slot-per-week'],
					isDouleSlot: item['is-double-period'],
					subTotalSlotPerWeek: item['sub-slot-per-week'],
					subIsDouleSlot: item['main-slot-per-week'],
					isRequiredSubject: item['is-required'],
					mainMinimumCouple: 0,
					subMinimumCouple: 0,
				} as ILessonTableData;
			});
			const tmpRequiredData: ILessonTableData[] = subjectGroupTableResponse.result[
				'subject-required-views'
			].map((item: ISubjectInGroup) => {
				return {
					id: item.id,
					lessonName: item['subject-name'],
					mainTotalSlotPerWeek: item['main-slot-per-week'],
					isDouleSlot: item['is-double-period'],
					subTotalSlotPerWeek: item['sub-slot-per-week'],
					subIsDouleSlot: item['is-double-period'],
					isRequiredSubject: item['is-required'],
				};
			});
			const optimizedData = useFilterArray(
				[...tmpSelectiveData, ...tmpRequiredData],
				'lessonName'
			);
			setLessonTableData(optimizedData);
		}
	}, [subjectGroupTableResponse]);

	useEffect(() => {
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
	}, [termData]);

	useEffect(() => {
		updateSubjectGroup({ schoolYearId: selectedSchoolYearId });
	}, [selectedSchoolYearId]);

	// Loading components
	if (isSubjectGroupValidating || isSubjectGroupTableValidating) {
		return (
			<div className='w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar'>
				<SMHeader>
					<div>
						<h3 className='text-title-small text-white font-semibold tracking-wider'>
							Tiết học
						</h3>
					</div>
				</SMHeader>
				<div className='w-full h-full flex flex-row justify-start items-start'>
					{isSubjectGroupValidating ? (
						<SubjectGroupSideNavSkeleton />
					) : (
						<SubjectGroupSideNav
							selectedSubjectGroup={selectedSubjectGroup}
							setSelectedSubjectGroup={setSelectedSubjectGroup}
							subjectGroup={subjectGroup}
						/>
					)}
					<LessonTableSkeleton />
				</div>
			</div>
		);
	}

	if (subjectGroupError) {
		useNotify({
			message:
				TRANSLATOR[subjectGroupError?.message] ?? 'Chưa có dữ liệu môn học cho năm học',
			type: 'error',
		});
	}

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Tiết học
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-full flex flex-row justify-start items-start'>
				<SubjectGroupSideNav
					selectedSubjectGroup={selectedSubjectGroup}
					setSelectedSubjectGroup={setSelectedSubjectGroup}
					subjectGroup={subjectGroup}
				/>
				<LessonTable
					subjectTableData={lessonTableData}
					termData={termDropdownData}
					selectedTermId={selectedTermId}
					setSelectedTermId={setSelectedTermId}
					selectedSubjectGroupId={selectedSubjectGroup}
					mutator={updateSubjectGroupTable}
				/>
			</div>
		</div>
	);
}
