'use client';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Typography } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
	AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { useState } from 'react';

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
		expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
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

interface SubjectGroupSidenavProps {
	subjectGroup: any;
}

const SubjectGroupSideNav = (props: SubjectGroupSidenavProps) => {
	const { subjectGroup } = props;
	const [expanded, setExpanded] = useState<string[]>(['panel0']);
	const [selectedSubjectGroup, setSelectedSubjectGroup] = useState<string>('');

	const handleSelectSubjectGroup = (url: string) => {
		// Implement logics here
	};

	const toggleDropdown =
		(panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
			if (newExpanded) {
				setExpanded((prev: string[]) => [...prev, panel]);
			} else {
				setExpanded((prev: string[]) => prev.filter((item) => item !== panel));
			}
		};

	return (
		<div className='w-[25%] h-full flex flex-col justify-start items-start border-r-1 border-gray-200'>
			<h1 className='text-title-small-strong w-full pl-5 py-3 text-center'>
				Tổ hợp môn
			</h1>
			<Accordion
				expanded={expanded.includes(`panel`)}
				onChange={toggleDropdown(`panel`)}
				className='w-full p-0 m-0'
			>
				<AccordionSummary
					aria-controls={`paneld-content`}
					id={`paneld-header`}
					className='!text-black !bg-basic-gray-hover'
				>
					<Typography>Khối 10</Typography>
				</AccordionSummary>
				<AccordionDetails className='w-full !p-2'>
					{subjectGroup.map((subjectGroup: any) => (
						<div
							key={subjectGroup.name}
							className={`w-[100%] h-fit flex flex-row justify-start items-center py-3 pl-5 pr-3 gap-5 rounded-[3px] hover:cursor-pointer 
									${
										selectedSubjectGroup === subjectGroup.url
											? 'bg-basic-gray-active '
											: 'hover:bg-basic-gray-hover'
									}`}
							onClick={() => handleSelectSubjectGroup(subjectGroup.url)}
						>
							<Image
								className='opacity-60'
								src={subjectGroup.icon}
								alt='sidebar-icon'
								unoptimized={true}
								width={23}
								height={23}
							/>
							<p
								className={`text-body-medium font-normal ${
									selectedSubjectGroup === subjectGroup.url
										? ' !font-semibold'
										: ''
								}`}
							>
								{subjectGroup.name}
							</p>
						</div>
					))}
				</AccordionDetails>
			</Accordion>
			{subjectGroup.map((subjectGroup: any, index: number) => (
				<div className='w-full pt-5' key={index}>
					<div className='w-full flex justify-between items-center px-5 py-1 my-2 hover:bg-basic-gray-hover'>
						<h3 className='text-body-large-strong text-primary-500'>
							{subjectGroup.classGroupName}
						</h3>
						<Image
							className='opacity-30'
							src={'/images/icons/drop-arrow.png'}
							alt='drop-arrow'
							unoptimized={true}
							width={13}
							height={13}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

export default SubjectGroupSideNav;
