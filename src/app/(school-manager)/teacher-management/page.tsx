'use client';

import SMHeader from '@/commons/school_manager/header';
import TeacherTable from './_components/teacher_table';
import { useTeacherData } from './_hooks/useTeacherData';
import LoadingComponent from '@/commons/loading';

export default function Home() {
	const { teachers, fetchTeachers, isLoading, error } = useTeacherData();

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Giáo viên
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-fit flex flex-col justify-center items-center px-[1vw] pt-[5vh]'>
				<LoadingComponent loadingStatus={isLoading} />
				{error ? (
					<p>Error: {error}</p>
				) : (
					<TeacherTable teachers={teachers} fetchTeachers={fetchTeachers} />
				)}
			</div>
		</div>
	);
}
