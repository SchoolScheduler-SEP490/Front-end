'use client';
import { Tab, Tabs } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TIMETABLE_GENERATION_TABS } from '../_libs/constants';

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

	useEffect(() => {
		if (pathName.length > 0) {
			const currentTab: string = pathName.split('/')[pathName.split('/').length - 1];
			const tabIndex = TIMETABLE_GENERATION_TABS.findIndex((tab) => tab.value === currentTab);
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
			<Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
				{TIMETABLE_GENERATION_TABS.map((tab, index) => (
					<Tab key={index} label={tab.label} {...a11yProps(index)} />
				))}
			</Tabs>
		</div>
	);
};

export default TimetableTabs;
