'use client';

import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { useState } from 'react';
import TeacherUnavailableSelector from './_components/TeacherUnavailableSelector';
import TeacherUnavailableResult from './_components/TeacherUnavailableResult';

const samepleTeacherData: IDropdownOption<number>[] = [
	{ label: 'Nguyen Ha Thanh Mai (maihnt)', value: 1 },
	{ label: 'Luong Hoang Anh (anhlh)', value: 2 },
	{ label: 'Nguyen Chien Thang (thangnc)', value: 3 },
	{ label: 'Nguyen Thanh Long (longnt)', value: 4 },
];

const sampleAppliedData = [
	{ id: 1, name: 'Nguyễn Thành Long', username: 'longnt' },
	{ id: 2, name: 'Nguyễn Chiến Thắng', username: 'thangnc' },
	{ id: 3, name: 'Lương Hoàng Anh', username: 'anhlh' },
	{ id: 4, name: 'Nguyễn Hà Thanh Mai', username: 'mainht' },
];

export default function TeacherUnavailability() {
	const [selectedTeacherIds, setSelectedTeacherIds] = useState<number[]>([1]);

	return (
		<div className='w-full h-full flex flex-row justify-between items-center'>
			<TeacherUnavailableSelector
				selectedTeacherIds={selectedTeacherIds}
				setSelectedTeacherIds={setSelectedTeacherIds}
				data={samepleTeacherData}
			/>
			<TeacherUnavailableResult data={sampleAppliedData} />
		</div>
	);
}
