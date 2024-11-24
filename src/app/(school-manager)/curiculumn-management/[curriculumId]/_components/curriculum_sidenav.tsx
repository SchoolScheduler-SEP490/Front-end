import { Tab, Tabs } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

function a11yProps(index: number) {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	};
}

interface ICurriculumSidenavProps {
	value: number;
	setValue: Dispatch<SetStateAction<number>>;
}

const CurriculumDetailsSidenav = (props: ICurriculumSidenavProps) => {
	const { value, setValue } = props;

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<div className='w-[25%] h-full flex flex-col justify-start items-start border-r-1 border-gray-200'>
			<h1 className='text-title-small-strong w-full pl-3 py-3 text-left'>Nội dung</h1>
			<Tabs
				orientation='vertical'
				variant='scrollable'
				value={value}
				onChange={handleChange}
				aria-label='Vertical tabs example'
				sx={{ borderRight: 1, borderColor: 'divider', width: '100%' }}
			>
				<Tab label='Thông tin chung' {...a11yProps(0)} />
				<Tab label='Tiết học' {...a11yProps(1)} />
			</Tabs>
		</div>
	);
};

export default CurriculumDetailsSidenav;
