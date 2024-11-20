'use client';

import { toggleMenu } from '@/context/slice_school_manager';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConstraintsSidenav from './_components/constraints_sidenav';
import { IConstraintsSidenavData } from './_libs/constants';

const sampleConstraints: IConstraintsSidenavData[] = [
	{
		category: 'Giáo viên',
		items: [
			{ label: 'Tạo lịch nghỉ/bận của giáo viên', value: 1 },
			{ label: 'Số buổi chỉ dạy 1 tiết/tuần', value: 2 },
			{ label: 'Số tiết dạy tối thiểu trong một buổi', value: 3 },
		],
	},
	{
		category: 'Tiết học',
		items: [
			{ label: 'Sắp tiết cố định', value: 4 },
			{ label: 'Tiết không học', value: 5 },
			{ label: 'Tiết đôi không học giờ ra chơi', value: 6 },
		],
	},
	{
		category: 'Môn học',
		items: [
			{ label: 'Số môn học tối đa/buổi', value: 7 },
			{ label: 'Môn học không học chung buổi với môn học khác', value: 8 },
			{ label: 'Môn học không dùng phòng', value: 9 },
		],
	},
	{
		category: 'Lớp học',
		items: [
			{ label: 'Thời gian nghỉ của lớp', value: 10 },
			{ label: 'Số tiết trống tối đa trong tuần', value: 11 },
			{ label: 'Số tiết tối đa trong ngày', value: 12 },
		],
	},
	{
		category: 'Phòng học',
		items: [
			{ label: 'Quy định số phòng học cho môn', value: 13 },
			{ label: 'Quy định số phòng học cho lớp', value: 14 },
		],
	},
];

export default function SMGenerationLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [selectedConstraintId, setSelectedConstraintId] = useState<number>(
		sampleConstraints[0].items[0].value
	);

	return (
		<div className='w-full h-full flex flex-row justify-start items-start overflow-y-visible'>
			<ConstraintsSidenav
				data={sampleConstraints}
				selectedConstraintId={selectedConstraintId}
				setSelectedConstraintId={setSelectedConstraintId}
			/>
			{children}
		</div>
	);
}
