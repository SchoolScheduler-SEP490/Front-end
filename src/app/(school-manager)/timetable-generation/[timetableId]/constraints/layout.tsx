'use client';

import ConstraintsSidenav from './_components/constraints_sidenav';
import { IConstraintsSidenavData } from './_libs/constants';

const constraints: IConstraintsSidenavData[] = [
	{
		category: 'Giáo viên',
		items: [
			{ label: 'Lịch nghỉ của giáo viên', value: 'teacher-unavailability' },
			// { label: 'Lịch bận của giáo viên', value: 'teacher-busy' },
		],
	},
	{
		category: 'Tiết học',
		items: [
			// { label: 'Sắp tiết cố định', value: 'fixed-periods' },
			// { label: 'Sắp tiết không xếp', value: 'empty-slots' },
			{ label: 'Sắp tiết trống cố định', value: 'free-timetable-periods' },
		],
	},
];

export default function SMGenerationLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='w-full h-full flex flex-row justify-start items-start overflow-y-visible'>
			<ConstraintsSidenav data={constraints} />
			{children}
		</div>
	);
}
