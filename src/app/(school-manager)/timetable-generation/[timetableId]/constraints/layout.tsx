'use client';

import ConstraintsSidenav from './_components/constraints_sidenav';
import { IConstraintsSidenavData } from './_libs/constants';

const constraints: IConstraintsSidenavData[] = [
	{
		category: 'Giáo viên',
		items: [
			{ label: 'Lịch nghỉ của giáo viên', value: 'teacher-unavailability' },
			{ label: 'Lịch bận của giáo viên', value: 'teacher-busy' },
		],
	},
	{
		category: 'Tiết học',
		items: [
			{ label: 'Sắp tiết cố định', value: 'fixed-periods' },
			{ label: 'Sắp tiết không xếp', value: 'empty-slots' },
			{ label: 'Sắp tiết trống cố định', value: 'free-timetable-periods' },
			{ label: 'Khoảng nghỉ giữa 2 buổi', value: 'break-periods' },
			{ label: 'Số ngày học trong tuần', value: 'number-of-weekdays' },
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
