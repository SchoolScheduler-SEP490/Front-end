'use client';
import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import { useEffect, useState } from 'react';
import TeachingAssignmentSideNavSkeleton from './_components/skeleton_sidenav';
import TeachingAssignmentFilterable from './_components/teaching_assignment_filterable';
import TeachingAssignmentSideNav from './_components/teaching_assignment_sidenav';
import useFetchClassData from './_hooks/useFetchClass';
import useSidenavDataConverter from './_hooks/useSidenavDataConverter';
import {
	IClassResponse,
	ITeachingAssignmentSidenavData,
	ITeachingAssignmentTableData,
} from './_libs/constants';
import TeachingAssignmentTable from './_components/teaching_assignment_table';
import TeachingAssignmentTableSkeleton from './_components/skeleton_table';
import TeachingAssignmentFilterableSkeleton from './_components/skeleton_filterable';

const sameplaData: ITeachingAssignmentTableData[] = [
	{
		id: 1,
		subjectName: 'Mathematics',
		teacherName: 'John Doe',
		totalSlotPerWeek: 5,
	},
	{
		id: 2,
		subjectName: 'Physics',
		teacherName: 'Jane Smith',
		totalSlotPerWeek: 4,
	},
	{
		id: 3,
		subjectName: 'Chemistry',
		teacherName: 'Alice Johnson',
		totalSlotPerWeek: 3,
	},
	{
		id: 4,
		subjectName: 'Biology',
		teacherName: 'Robert Brown',
		totalSlotPerWeek: 4,
	},
	{
		id: 5,
		subjectName: 'History',
		teacherName: 'Michael Davis',
		totalSlotPerWeek: 2,
	},
	{
		id: 6,
		subjectName: 'Geography',
		teacherName: 'Emily Wilson',
		totalSlotPerWeek: 3,
	},
	{
		id: 7,
		subjectName: 'English',
		teacherName: 'David Martinez',
		totalSlotPerWeek: 5,
	},
	{
		id: 8,
		subjectName: 'Physical Education',
		teacherName: 'Daniel Anderson',
		totalSlotPerWeek: 2,
	},
	{
		id: 9,
		subjectName: 'Art',
		teacherName: 'Sophia Thomas',
		totalSlotPerWeek: 1,
	},
	{
		id: 10,
		subjectName: 'Music',
		teacherName: 'Emma Taylor',
		totalSlotPerWeek: 2,
	},
];

export default function SMTeachingAssignment() {
	const { sessionToken, schoolId } = useAppContext();
	const [selectedClass, setSelectedClass] = useState<number>(0);
	const [sidenavData, setSidenavData] = useState<ITeachingAssignmentSidenavData[]>([]);
	const [selectedYearId, setSelectedYearId] = useState<number>(1);
	const [selectedTermId, setSelectedTermId] = useState<number>(1);
	const [isFilterable, setIsFilterable] = useState<boolean>(true);

	const {
		data: classData,
		error: classError,
		isValidating: isClassValidating,
		isLoading: isClassLoading,
		mutate: updateClass,
	} = useFetchClassData({
		sessionToken,
		schoolId,
		pageSize: 100,
		pageIndex: 1,
		schoolYearId: selectedYearId,
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

	if (isClassValidating) {
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
					<TeachingAssignmentSideNavSkeleton />
					<div className='w-[80%] h-full flex justify-center items-start gap-5 overflow-y-scroll no-scrollbar'>
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
						Tiết học
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-full flex flex-row justify-start items-start overflow-y-hidden'>
				<TeachingAssignmentSideNav
					selectedClass={selectedClass}
					setSelectedClass={setSelectedClass}
					classData={sidenavData}
				/>
				<div className='w-[80%] h-full flex justify-center items-start gap-5 overflow-y-scroll no-scrollbar'>
					<TeachingAssignmentTable
						subjectData={sameplaData}
						// mutate={updateClass}
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
			1
		</div>
	);
}
