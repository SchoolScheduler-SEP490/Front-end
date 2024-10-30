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
	ISGSubject,
	ISubjectGroupObjectResponse,
	ISubjectGroupSidenavData,
} from './_libs/constants';
import useSidenavDataConverter from './_hooks/useSidenavDataConverter';
import useFetchSGTableData from './_hooks/useFetchSGTableData';

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
		// updateSubjectGroupTable();
		// if (subjectGroupTableResponse?.status === 200) {
		// 	var index = 1;
		// 	const tmpData: ILessonTableData[] = subjectGroupTableResponse.result[].map(
		// 		(item: ISGSubject) => {
		// 			return {
		// 				id: index++,
		// 				lessonName: item['subject-name'],
		// 				mainTotalSlotPerWeek: item['main-slot-per-week'],
		// 				isDouleSlot: item['is-double-period'],
		// 				subTotalSlotPerWeek: item['sub-slot-per-week'],
		// 				subIsDouleSlot: item['main-slot-per-week'],
		// 				isRequiredSubject: item['is-required'],
		// 			};
		// 		}
		// 	);
		// 	setLessonTableData(tmpData);
		// }
	}, [subjectGroupTableResponse]);

	useEffect(() => {
		updateSubjectGroup({ schoolYearId: selectedYearId });
	}, [selectedYearId]);

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
					<SubjectGroupSideNavSkeleton />
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
				/>
			</div>
		</div>
	);
}
