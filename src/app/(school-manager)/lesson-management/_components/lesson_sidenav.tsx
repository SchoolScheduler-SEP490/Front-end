'use client';
import { inter } from '@/utils/fonts';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Typography } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { ICurriculumSidenavData } from '../_libs/constants';

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

interface CurriculumSidenavProps {
	curriculum: ICurriculumSidenavData[];
	selectedCurriculum: number;
	setSelectedCurriculum: React.Dispatch<React.SetStateAction<number>>;
}

const CurriculumSideNav = (props: CurriculumSidenavProps) => {
	const { curriculum: subjectGroup, selectedCurriculum, setSelectedCurriculum } = props;
	const [expanded, setExpanded] = useState<string[]>(['panel0']);

	const handleSelectCurriculum = (target: number) => {
		// Implement logics here
		setSelectedCurriculum(target);
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
		subjectGroup.map((item, index) => {
			item.items.map((subItem) => {
				if (subItem.value === selectedCurriculum) {
					setExpanded((prev: string[]) => [...prev, `panel${index}`]);
				}
			});
		});
	}, [selectedCurriculum]);

	return (
		<div className='w-[25%] h-full flex flex-col justify-start items-start border-r-1 border-gray-200'>
			<h1 className='text-title-small-strong w-full pl-3 py-3 text-left'>
				Khung chương trình
			</h1>
			{subjectGroup.length === 0 && (
				<p className='text-body-medium w-full pl-3 py-3 text-left italic'>
					Năm học chưa có Khung chương trình
				</p>
			)}
			{subjectGroup.map((item, index) => (
				<Accordion
					expanded={expanded.includes(`panel${index}`)}
					onChange={toggleDropdown(`panel${index}`)}
					className='w-full p-0 m-0'
					key={item.title + index}
				>
					<AccordionSummary
						aria-controls={`panel${index}d-content`}
						id={`panel${index}d-header`}
						className='!text-black !bg-basic-gray-hover '
					>
						<Typography className='!text-body-large-strong'>{item.title}</Typography>
					</AccordionSummary>
					<AccordionDetails className='!w-full !p-0'>
						{item.items.map((subjectGroup, id: number) => (
							<div
								key={subjectGroup.key + id}
								className={`w-[100%] h-fit flex flex-row justify-start items-center py-2 pl-6 pr-3 gap-5 hover:cursor-pointer 
									${
										selectedCurriculum === subjectGroup.value
											? 'bg-basic-gray-active '
											: 'hover:bg-basic-gray-hover'
									}`}
								onClick={() => handleSelectCurriculum(subjectGroup.value)}
							>
								<p
									className={`${
										inter.className
									} antialiased text-body-medium font-normal opacity-90 ${
										selectedCurriculum === subjectGroup.value
											? ' !font-medium'
											: ''
									}`}
								>
									{subjectGroup.key}
								</p>
							</div>
						))}
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	);
};

export default CurriculumSideNav;
