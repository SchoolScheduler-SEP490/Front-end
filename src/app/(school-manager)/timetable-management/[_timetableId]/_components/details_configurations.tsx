'use client';
import { useState } from 'react';
import ConfigurationSidenav from './details_configurations/sidenav';
import DetailsGeneralInformation from './details_configurations/details_general_information';
import DetailsTeachingAssignment from './details_configurations/details_teaching_assignment';
import DetailsTeachersLessons from './details_configurations/details_teachers_lessions';
import DetailsConstraints from './details_configurations/details_constraints';

interface IDetailsConfigurationProps {
	// Add data here
}

const DetailsConfiguration: React.FC<IDetailsConfigurationProps> = () => {
	const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

	return (
		<div className='w-full h-full flex flex-row justify-start items-start overflow-hidden'>
			<ConfigurationSidenav
				selectedTabIndex={selectedTabIndex}
				setSelectedTabIndex={setSelectedTabIndex}
			/>

            {selectedTabIndex === 0 && (<DetailsGeneralInformation/>)}
            {selectedTabIndex === 1 && (<DetailsConstraints/>)}
            {selectedTabIndex === 2 && (<DetailsTeachingAssignment/>)}
            {selectedTabIndex === 3 && (<DetailsTeachersLessons/>)}
		</div>
	);
};

export default DetailsConfiguration;
