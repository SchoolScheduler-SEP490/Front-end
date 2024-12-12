'use client';
import { inter } from '@/utils/fonts';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Typography } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { IClassCombinationResponse, ITeachersLessonsSidenavData } from '../_libs/constants';

const Accordion = styled((props: AccordionProps) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	'&:not(:last-child)': {
		borderBottom: 0,
	},
	'&::before': {
		display: 'none',
	},
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary
		expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.5rem', border: 'none' }} />}
		{...props}
	/>
))(({ theme }) => ({
	flexDirection: 'row-reverse',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(90deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1.5),
	},
	...theme.applyStyles('dark', {
		backgroundColor: 'rgba(255, 255, 255, .05)',
	}),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	width: '100%',
	borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

interface TeachersLessonsSidenavProps {
	classData: ITeachersLessonsSidenavData[];
	selectedClass: number;
	setSelectedClass: React.Dispatch<React.SetStateAction<number>>;
	setSelectedGrade: React.Dispatch<React.SetStateAction<string>>;
	classCombinationData: IClassCombinationResponse[];
	selectedCombination: number;
	setSelectedCombination: React.Dispatch<React.SetStateAction<number>>;
	setIsCombinationClass: React.Dispatch<React.SetStateAction<boolean>>;
}

const TeachersLessonsSideNav = (props: TeachersLessonsSidenavProps) => {
	const {
		classData,
		selectedClass,
		setSelectedClass,
		setSelectedGrade,
		classCombinationData,
		selectedCombination,
		setSelectedCombination,
		setIsCombinationClass,
	} = props;
	const [expanded, setExpanded] = useState<string[]>(['panel0']);
	const [sidenavData, setSidenavData] = useState<ITeachersLessonsSidenavData[]>([]);

	useEffect(() => {
		setSidenavData([]);
		if (classCombinationData.length > 0 && classData.length > 0) {
			const tmpClassCombinationData: ITeachersLessonsSidenavData = {
				title: 'Lớp ghép',
				items: [],
				grade: 'combination',
			};
			classCombinationData.forEach((item: IClassCombinationResponse) => {
				tmpClassCombinationData.items.push({
					key: item['room-subject-name'],
					value: item.id,
					extra: 'combination',
				});
			});
			setSidenavData([tmpClassCombinationData, ...classData]);
			if (classCombinationData.length > 0) {
				setSelectedCombination(tmpClassCombinationData.items[0].value);
			} else {
				setSelectedClass(sidenavData[0].items[0].value);
			}
		} else setSidenavData(classData);
	}, [classCombinationData, classData]);

	const handleSelectCurriculum = (target: number, extra: string, grade: string) => {
		setSelectedGrade(grade);
		if (extra === 'combination') {
			setSelectedClass(0);
			setSelectedCombination(target);
			setIsCombinationClass(true);
		} else {
			setSelectedClass(target);
			setSelectedCombination(0);
			setIsCombinationClass(false);
		}
	};

	const toggleDropdown = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
		if (newExpanded) {
			setExpanded((prev: string[]) => [...prev, panel]);
		} else {
			setExpanded((prev: string[]) => prev.filter((item) => item !== panel));
		}
	};

	useEffect(() => {
		classData.map((item, index) => {
			item.items.map((subItem) => {
				if (subItem.value === selectedClass) {
					setExpanded((prev: string[]) => [...prev, `panel${index}`]);
				}
			});
		});
	}, [selectedClass]);

	return (
		<div className='w-[20%] h-full max-h-[90%] pb-[5vh] flex flex-col justify-start items-start border-r-1 border-gray-200 overflow-y-scroll no-scrollbar'>
			<h1 className='text-body-large-strong w-full pl-3 py-3 text-left'>Lớp học</h1>
			{sidenavData.length === 0 && (
				<p className='text-body-medium w-full pl-3 py-3 text-left italic'>
					Năm học chưa có lớp học
				</p>
			)}
			{sidenavData.map((grade, index) => (
				<Accordion
					expanded={expanded.includes(`panel${index}`)}
					onChange={toggleDropdown(`panel${index}`)}
					className='w-full p-0 m-0'
					key={grade.title + index}
				>
					<AccordionSummary
						aria-controls={`panel${index}d-content`}
						id={`panel${index}d-header`}
						className='!text-black !bg-basic-gray-hover '
					>
						<Typography className='!text-body-large-strong'>{grade.title}</Typography>
					</AccordionSummary>
					<AccordionDetails className='!w-full !p-0'>
						{grade.items.map((gradeClass, id: number) => (
							<div
								key={gradeClass.key + id}
								className={`w-[100%] h-fit flex flex-row justify-start items-center py-2 pl-6 pr-3 gap-5 hover:cursor-pointer 
									${
										selectedClass === gradeClass.value || selectedCombination === gradeClass.value
											? 'bg-basic-gray-active '
											: 'hover:bg-basic-gray-hover'
									}`}
								onClick={() =>
									handleSelectCurriculum(gradeClass.value, gradeClass.extra, grade.grade)
								}
							>
								<p
									className={`${
										inter.className
									} antialiased text-body-medium font-normal opacity-90 ${
										selectedClass === gradeClass.value ? ' !font-medium' : ''
									}`}
								>
									{gradeClass.key}
								</p>
							</div>
						))}
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	);
};

export default TeachersLessonsSideNav;
