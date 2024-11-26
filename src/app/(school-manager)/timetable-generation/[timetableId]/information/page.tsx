'use client';
import { useState } from 'react';
import InformationSidenav from './_components/information_sidenav';
import { Paper } from '@mui/material';
import TeacherInformationTable from './_components/information_table_teacher';
import CurriculumInformationTable from './_components/information_table_curriculum';
import StudentClassInformationTable from './_components/information_table_studentclass';

export default function Home() {
	const [selectedCategory, setSelectedCategory] = useState<string>('teachers');

	return (
		<div className='w-full h-screen flex flex-row justify-start items-start'>
			<InformationSidenav
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
			/>
			{selectedCategory === 'teachers' && <TeacherInformationTable />}
			{selectedCategory === 'curriculums' && <CurriculumInformationTable />}
			{selectedCategory === 'classes' && <StudentClassInformationTable />}
		</div>
	);
}
