'use client';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import { Button, Tab, Tabs, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TIMETABLE_GENERATION_TABS } from '../_libs/constants';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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

	const handleNext = () => {
		const tmpPathArr: string[] = pathName.split('/');
		tmpPathArr.splice(3);
		tmpPathArr.push(TIMETABLE_GENERATION_TABS[value + 1].value);
		router.push(tmpPathArr.join('/'));
		setValue(value + 1);
	};

	const handleBack = () => {
		const tmpPathArr: string[] = pathName.split('/');
		tmpPathArr.splice(3);
		tmpPathArr.push(TIMETABLE_GENERATION_TABS[value - 1].value);
		router.push(tmpPathArr.join('/'));
		setValue(value - 1);
	};

	return (
		<div className='w-full h-fit border-b-1 border-basic-gray flex flex-row justify-between items-center px-2'>
			<Button
				variant='contained'
				color='inherit'
				startIcon={<ArrowBackIosIcon fontSize='small' />}
				onClick={handleBack}
				disabled={value === 0}
				sx={{
					bgcolor: '#F5F5F5',
					color: 'rgba(0, 0, 0, .6)',
					borderRadius: 0,
					boxShadow: 'none',
					height: '80%',
					minWidth: 130,
				}}
			>
				<Typography>trở về</Typography>
			</Button>
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
			<Button
				variant='contained'
				color='inherit'
				endIcon={<ArrowForwardIosIcon fontSize='small' />}
				onClick={handleNext}
				disabled={value === TIMETABLE_GENERATION_TABS.length - 1}
				sx={{
					bgcolor: '#e6edf3',
					color: '#004e89',
					borderRadius: 0,
					boxShadow: 'none',
					height: '80%',
					minWidth: 200,
				}}
			>
				<Typography>bước tiếp theo</Typography>
			</Button>
		</div>
	);
};

export default TimetableTabs;
