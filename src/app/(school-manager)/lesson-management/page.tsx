'use client';
import SMHeader from '@/commons/school_manager/header';
import LessonTable from './_components/lesson_table';
import SubjectGroupSideNavSkeleton from './_components/skeleton_sidenav';
import SubjectGroupSideNav from './_components/subject_group_sidenav';
import LessonTableSkeleton from './_components/skeleton_table';
import { useEffect, useState } from 'react';
import useFetchSGSidenav from './_hooks/useFetchSubjectGroup';
import { useAppContext } from '@/context/app_provider';
import {
	ILessonTableData,
	ISubjectInGroup,
	ISubjectGroupObjectResponse,
	ISubjectGroupSidenavData,
} from './_libs/constants';
import useSidenavDataConverter from './_hooks/useSidenavDataConverter';
import useFetchSGTableData from './_hooks/useFetchSGTableData';
import useFilterArray from '@/hooks/useFilterArray';

export default function SMLesson() {
	const { schoolId, sessionToken } = useAppContext();

	const [selectedSubjectGroup, setSelectedSubjectGroup] = useState<number>(0);
	const [selectedYearId, setSelectedYearId] = useState<number>(1);
	const [subjectGroup, setSubjectGroup] = useState<ISubjectGroupSidenavData[]>([]);
	const [lessonTableData, setLessonTableData] = useState<ILessonTableData[]>([]);
	const {
		data: subjectGroupData,
		mutate: updateSubjectGroup,
		isLoading: isSubjectGroupLoading,
		isValidating: isSubjectGroupValidating,
	} = useFetchSGSidenav({
		sessionToken: sessionToken,
		schoolId: schoolId,
		pageIndex: 1,
		pageSize: 100,
		schoolYearId: selectedYearId,
	});
	const {
		data: subjectGroupTableResponse,
		error: subjectTableError,
		isValidating: isSubjectGroupTableValidating,
		mutate: updateSubjectGroupTable,
	} = useFetchSGTableData({
		sessionToken: sessionToken,
		subjectGroupId: selectedSubjectGroup,
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
				};
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
		updateSubjectGroup({ schoolYearId: selectedYearId });
	}, [selectedYearId]);

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
					selectedYearId={selectedYearId}
					setSelectedYearId={setSelectedYearId}
					mutator={updateSubjectGroupTable}
				/>
			</div>
		</div>
	);
}
