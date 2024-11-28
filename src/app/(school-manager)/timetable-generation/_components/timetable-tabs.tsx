'use client';
import { Tab, Tabs } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TIMETABLE_GENERATION_TABS } from '../_libs/constants';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import { useSelector } from 'react-redux';
import { IConfigurationStoreObject } from '@/utils/constants';

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const TimetableTabs = () => {
	const pathName = usePathname();
	const [value, setValue] = useState(0);
	const router = useRouter();
	const { dataStored }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);

	useEffect(() => {
		if (pathName.length > 0) {
			const currentTab: string[] = pathName.split('/');
			const tabIndex = TIMETABLE_GENERATION_TABS.findIndex((tab) =>
				currentTab.includes(tab.value)
			);
			setValue(tabIndex);
		}
	}, [pathName]);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		const tmpPathArr: string[] = pathName.split('/');
		tmpPathArr.splice(3);
		tmpPathArr.push(TIMETABLE_GENERATION_TABS[newValue].value);
		router.push(tmpPathArr.join('/'));
		setValue(newValue);
	};

	return (
		<div className='w-full h-fit border-b-1 border-basic-gray flex flex-row justify-center'>
			<Tabs
				value={value}
				onChange={handleChange}
				aria-label='basic tabs example'
				variant='scrollable'
				scrollButtons
				allowScrollButtonsMobile
			>
				<Tab label='0. Thông tin chung' {...a11yProps(0)} />
				<Tab label='1. Cấu hình ràng buộc' {...a11yProps(1)} />
				<Tab label='2. Phân công giáo viên' {...a11yProps(1)} />
				<Tab
					label='3. Xếp tiết cố định'
					disabled={dataStored['teacher-assignments']?.length === 0}
					{...a11yProps(3)}
				/>
				<Tab
					label='4. Tạo thời khóa biểu'
					// disabled={dataStored['teacher-assignments'].length === 0}
					{...a11yProps(3)}
				/>
			</Tabs>
		</div>
	);
};

export default TimetableTabs;
