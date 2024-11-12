'use client';
import { inter } from '@/utils/fonts';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Typography } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { ITeachingAssignmentSidenavData } from '../_libs/constants';

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

interface TeachingAssignmentSidenavProps {
	classData: ITeachingAssignmentSidenavData[];
	selectedClass: number;
	setSelectedClass: React.Dispatch<React.SetStateAction<number>>;
	setSelectedSubjectGroupName: React.Dispatch<React.SetStateAction<string>>;
}

const TeachingAssignmentSideNav = (props: TeachingAssignmentSidenavProps) => {
	const { classData, selectedClass, setSelectedClass, setSelectedSubjectGroupName } = props;
	const [expanded, setExpanded] = useState<string[]>(['panel0']);

	const handleSelectSubjectGroup = (target: number, extra: string) => {
		// Implement logics here
		setSelectedClass(target);
		setSelectedSubjectGroupName(extra);
	};

	const toggleDropdown =
		(panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
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
		<div className='w-[20%] h-full flex flex-col justify-start items-start border-r-1 border-gray-200 overflow-y-scroll no-scrollbar'>
			<h1 className='text-title-small-strong w-full pl-3 py-3 text-left'>Lớp học</h1>
			{classData.length === 0 && (
				<p className='text-body-medium w-full pl-3 py-3 text-left italic'>
					Năm học chưa có lớp học
				</p>
			)}
			{classData.map((grade, index) => (
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
									${selectedClass === gradeClass.value ? 'bg-basic-gray-active ' : 'hover:bg-basic-gray-hover'}`}
								onClick={() =>
									handleSelectSubjectGroup(gradeClass.value, gradeClass.extra)
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

export default TeachingAssignmentSideNav;
