import SMHeader from '@/commons/school_manager/header';
import LessonTable from './_components/lesson_table';
import SubjectGroupSideNavSkeleton from './_components/skeleton_sidenav';
import SubjectGroupSideNav from './_components/subject_group_sidenav';
import LessonTableSkeleton from './_components/skeleton_table';

export default function SMLesson() {
	if (false) {
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
				<SubjectGroupSideNav subjectGroup={[]} />
				<LessonTable
					subjectTableData={[
						{
							id: 1,
							lessonName: 'Toán',
							mainTotalSlotPerWeek: 5,
							mainMinOfDouleSlot: 2,
							subTotalSlotPerWeek: 5,
							subMinOfDouleSlot: 2,
						},
						{
							id: 2,
							lessonName: 'Văn',
							mainTotalSlotPerWeek: 5,
							mainMinOfDouleSlot: 2,
							subTotalSlotPerWeek: 5,
							subMinOfDouleSlot: 2,
						},
						{
							id: 3,
							lessonName: 'Anh',
							mainTotalSlotPerWeek: 5,
							mainMinOfDouleSlot: 2,
							subTotalSlotPerWeek: 5,
							subMinOfDouleSlot: 2,
						},
					]}
				/>
			</div>
		</div>
	);
}
