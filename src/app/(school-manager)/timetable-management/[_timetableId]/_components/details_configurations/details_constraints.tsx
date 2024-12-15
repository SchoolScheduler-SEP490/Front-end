import {
    Box,
    Tab,
    Tabs
} from '@mui/material';
import { FC, useState } from 'react';
import DetailsFreeTimetablePeriod from './details_constraints/details_free_timetable_period';
import DetailsGeneralConfiguration from './details_constraints/details_general_configurations';
import DetailsTeacherUnavailability from './details_constraints/details_teacher_unavailability';

interface IDetailsConstraintsProps {}

const DetailsConstraints: FC<IDetailsConstraintsProps> = (props) => {
	const [selectedTab, setSelectedTab] = useState<string>('general-configuration');
    const {} = props;

	const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
		setSelectedTab(newValue);
	};
	return (
		<Box sx={{ width: '80%' }}>
			{/* Tab Selector */}
			<Tabs
				value={selectedTab}
				onChange={handleTabChange}
				aria-label='Information Tabs'
				centered
				textColor='primary'
				indicatorColor='primary'
			>
				<Tab value='general-configuration' label='Cấu hình chung' />
				<Tab value='teacher-unavailability' label='Lịch bận giáo viên' />
				<Tab value='free-timetable' label='Tiết trống cố định' />
			</Tabs>

			{/* Content */}
			<Box>
				{selectedTab === 'general-configuration' && <DetailsGeneralConfiguration />}
				{selectedTab === 'teacher-unavailability' && <DetailsTeacherUnavailability />}
				{selectedTab === 'free-timetable' && <DetailsFreeTimetablePeriod />}
			</Box>
		</Box>
	);
};

export default DetailsConstraints;
