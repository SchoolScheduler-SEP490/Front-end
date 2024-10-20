'use client';

import SMHeader from '@/commons/school_manager/header';
import TeacherTable from './_components/teacher_table';
import { useTeacherData } from './_hooks/custom_hook';
import { Backdrop, CircularProgress } from '@mui/material';

export default function Home() {
	const { teachers, loading, error } = useTeacherData();

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Giáo viên
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-fit flex flex-col justify-center items-center px-[1vw] pt-[5vh]'>
				{loading ? (
					<Backdrop
						sx={(theme) => ({
							color: '#fff',
							zIndex: theme.zIndex.drawer + 1,
						})}
						open={loading}
					>
						<CircularProgress color='inherit' />
					</Backdrop>
				) : error ? (
					<p>Error: {error}</p>
				) : (
					<TeacherTable teachers={teachers} />
				)}
			</div>
		</div>
	);
}
