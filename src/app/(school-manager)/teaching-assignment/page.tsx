'use client';
import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import useFilterArray from '@/hooks/useFilterArray';
import { useEffect, useState } from 'react';
import TeachingAssignmentFilterableSkeleton from './_components/skeleton_filterable';
import TeachingAssignmentSideNavSkeleton from './_components/skeleton_sidenav';
import TeachingAssignmentTableSkeleton from './_components/skeleton_table';
import TeachingAssignmentFilterable from './_components/teaching_assignment_filterable';
import TeachingAssignmentSideNav from './_components/teaching_assignment_sidenav';
import TeachingAssignmentTable from './_components/teaching_assignment_table';
import useFetchClassData from './_hooks/useFetchClass';
import useFetchTeachingAssignment from './_hooks/useFetchTA';
import useFetchTeacher from './_hooks/useFetchTeacher';
import useSidenavDataConverter from './_hooks/useSidenavDataConverter';
import {
	IClassResponse,
	ITeachingAssignmentResponse,
	ITeachingAssignmentSidenavData,
	ITeachingAssignmentTableData,
} from './_libs/constants';

export default function SMTeachingAssignment() {
	const { sessionToken, schoolId } = useAppContext();

	const [selectedClass, setSelectedClass] = useState<number>(0);
	const [sidenavData, setSidenavData] = useState<ITeachingAssignmentSidenavData[]>([]);
	const [selectedYearId, setSelectedYearId] = useState<number>(1);
	const [selectedTermId, setSelectedTermId] = useState<number>(1);
	const [isFilterable, setIsFilterable] = useState<boolean>(true);
	const [tableData, setTableData] = useState<ITeachingAssignmentTableData[]>([]);

	const {
		data: classData,
		isValidating: isClassValidating,
		mutate: updateClass,
	} = useFetchClassData({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
		schoolYearId: selectedYearId,
	});

	const {
		data: teachingAssignmentData,
		mutate: updateTeachingAssignment,
		isValidating: isTeachingAssignmentValidating,
	} = useFetchTeachingAssignment({
		sessionToken,
		studentClassId: selectedClass,
		termId: selectedTermId,
	});

	const {
		data: teacherData,
		mutate: updateTeacher,
		isValidating: isTeacherValidating,
	} = useFetchTeacher({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
	});

	useEffect(() => {
		updateClass();
		if (classData?.status === 200) {
			const tmpData: ITeachingAssignmentSidenavData[] = useSidenavDataConverter(
				classData.result.items as IClassResponse[]
			);
			if (tmpData.length > 0) {
				setSidenavData(tmpData);
				setSelectedClass(tmpData[0].items[0].value);
			}
		}
	}, [classData]);

	// Process data after fetching teaching assignment data
	useEffect(() => {
		updateTeachingAssignment();
		if (teachingAssignmentData?.status === 200 && teacherData?.status === 200) {
			const assignedList: ITeachingAssignmentTableData[] =
				teachingAssignmentData.result['teacher-assignt-view'].map(
					(item: ITeachingAssignmentResponse) => {
						return {
							id: item.id,
							subjectName: item['subject-name'],
							teacherName: {
								label: `${item['teacher-first-name']} ${item['teacher-last-name']} (${item['teacher-abbreviation']})`,
								value: item['teacher-id'],
							},
							totalSlotPerWeek: item['period-count'],
							subjectKey: item['subject-id'],
						} as ITeachingAssignmentTableData;
					}
				);
			const notAssignedList: ITeachingAssignmentTableData[] =
				teachingAssignmentData.result['teacher-not-assignt-view'].map(
					(item: ITeachingAssignmentResponse) => {
						return {
							id: item.id,
							subjectName: item['subject-name'],
							teacherName: { label: '- - -', value: 0 },
							totalSlotPerWeek: item['period-count'],
							subjectKey: item['subject-id'],
						} as ITeachingAssignmentTableData;
					}
				);
			const tableData: ITeachingAssignmentTableData[] = useFilterArray(
				[...notAssignedList, ...assignedList],
				'id'
			).reverse();
			console.log(JSON.stringify(tableData, null, 2));
			setTableData(tableData);
		}
	}, [teachingAssignmentData, teacherData]);

	// Render skeleton if data while fetching data
	if (isClassValidating || isTeachingAssignmentValidating || isTeacherValidating) {
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
					{isClassValidating ? (
						<TeachingAssignmentSideNavSkeleton />
					) : (
						<TeachingAssignmentSideNav
							selectedClass={selectedClass}
							setSelectedClass={setSelectedClass}
							classData={sidenavData}
						/>
					)}
					<div className='w-[85%] h-full flex justify-center items-start gap-5 overflow-y-scroll no-scrollbar'>
						<TeachingAssignmentTableSkeleton />
						<TeachingAssignmentFilterableSkeleton />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Phân công giảng dạy
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-full flex flex-row justify-start items-start overflow-y-hidden'>
				<TeachingAssignmentSideNav
					selectedClass={selectedClass}
					setSelectedClass={setSelectedClass}
					classData={sidenavData}
				/>
				<div className='w-[85%] h-full flex justify-center items-start gap-5 overflow-y-scroll no-scrollbar'>
					<TeachingAssignmentTable
						subjectData={tableData}
						mutate={updateTeachingAssignment}
						isFilterable={isFilterable}
						setIsFilterable={setIsFilterable}
					/>
					<TeachingAssignmentFilterable
						open={isFilterable}
						setOpen={setIsFilterable}
						selectedYearId={selectedYearId}
						setSelectedYearId={setSelectedYearId}
						selectedTermId={selectedTermId}
						setSelectedTermId={setSelectedTermId}
					/>
				</div>
			</div>
		</div>
	);
}
