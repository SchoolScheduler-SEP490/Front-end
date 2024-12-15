import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { TIMETABLE_GENERATION_TABS } from '../../_libs/constants';


interface IConfigurationSidenavProps {
	selectedTabIndex:number;
	setSelectedTabIndex:Dispatch<SetStateAction<number>>;
}

const ConfigurationSidenav = (props: IConfigurationSidenavProps) => {
	const {selectedTabIndex,setSelectedTabIndex} = props;
	const pathName = usePathname();
	const router = useRouter();
	const currentPath = pathName.split('/')[4];

	const handleSelectConstraint = (index:number) => {
		setSelectedTabIndex(index);
	};

	return (
		<div className='w-[20%] h-[90vh] flex flex-col justify-start items-start border-r-1 border-gray-200'>
			<h1 className='text-body-large-strong w-full pl-3 py-3 text-left'>Danh mục</h1>
			{TIMETABLE_GENERATION_TABS.slice(0, -1).map((item, index) => (
				<div
					key={item.label + index}
					className={`w-[100%] h-fit flex flex-row justify-start items-center py-2 pl-6 pr-3 select-none gap-5 hover:cursor-pointer 
                        ${
													selectedTabIndex === index
														? 'bg-basic-gray-active '
														: 'hover:bg-basic-gray-hover'
												}`}
					onClick={() => handleSelectConstraint(index)}
				>
					<p
						className={`text-body-medium font-normal w-full ${
							currentPath === item.value ? ' !font-semibold' : ''
						}`}
					>
						{item.label}
					</p>
				</div>
			))}
		</div>
	);
};

export default ConfigurationSidenav;
