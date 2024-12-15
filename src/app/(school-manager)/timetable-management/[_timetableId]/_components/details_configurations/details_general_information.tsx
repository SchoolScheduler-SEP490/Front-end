import { useState } from "react";
import DetailsTeacherTable from "./details_general_information/table_teacher";
import DetailsCurriculumTable from "./details_general_information/table_curriculum";
import DetailsStudentClassTable from "./details_general_information/table_studentclass";
import { Box, Tab, Tabs } from "@mui/material";

interface IDetailsGeneralInformationProps {
	// Add data here
}

const DetailsGeneralInformation: React.FC<IDetailsGeneralInformationProps> = (props) => {
	const [selectedTab, setSelectedTab] = useState<string>('teachers');
    
    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
      };
	return (
		<Box sx={{ width: '80%'}}>
			{/* Tab Selector */}
			<Tabs
				value={selectedTab}
				onChange={handleTabChange}
				aria-label='Information Tabs'
				centered
				textColor='primary'
				indicatorColor='primary'
			>
				<Tab value='teachers' label='Giáo viên' />
				<Tab value='curriculums' label='Khung chương trình' />
				<Tab value='classes' label='Lớp học' />
			</Tabs>

			{/* Content */}
			<Box>
				{selectedTab === 'teachers' && <DetailsTeacherTable />}
				{selectedTab === 'curriculums' && <DetailsCurriculumTable />}
				{selectedTab === 'classes' && <DetailsStudentClassTable />}
			</Box>
		</Box>
	);
};

export default DetailsGeneralInformation;
