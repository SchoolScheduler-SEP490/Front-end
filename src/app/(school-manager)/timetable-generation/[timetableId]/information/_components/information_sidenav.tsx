import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { Dispatch, SetStateAction } from 'react';

const sidenavCategories: IDropdownOption<string>[] = [
	{ label: 'Giáo viên', value: 'teachers' },
	{ label: 'Khung chương trình', value: 'curriculums' },
	{ label: 'Lớp học', value: 'classes' },
];

interface IInformationSidenavProps {
	selectedCategory: string;
	setSelectedCategory: Dispatch<SetStateAction<string>>;
}

const InformationSidenav = (props: IInformationSidenavProps) => {
	const { selectedCategory, setSelectedCategory } = props;

	const handleSelectCategory = (url: string) => {
		setSelectedCategory(url);
	};

	return (
		<div className='w-[20%] h-full flex flex-col justify-start items-start border-r-1 border-gray-200'>
			<h1 className='text-title-small-strong w-full pl-3 py-3 text-left'>Đối tượng</h1>
			{sidenavCategories.map((category: IDropdownOption<string>, index: number) => (
				<div
					key={index}
					className={`w-[100%] h-fit flex flex-row justify-start items-center py-3 pl-8 pr-3 select-none gap-5 hover:cursor-pointer 
									${selectedCategory === category.value ? 'bg-basic-gray-active ' : 'hover:bg-basic-gray-hover'}`}
					onClick={() => handleSelectCategory(category.value)}
				>
					<p
						className={`text-body-medium font-normal w-full ${
							selectedCategory === category.value ? ' !font-semibold' : ''
						}`}
					>
						{category.label}
					</p>
				</div>
			))}
		</div>
	);
};

export default InformationSidenav;
