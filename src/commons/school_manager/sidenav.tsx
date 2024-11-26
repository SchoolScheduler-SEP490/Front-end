'use client';

import { ISMNavigation, ISMSidenav, SM_SIDENAV } from '@/app/(school-manager)/_utils/contants';
import { useAppContext } from '@/context/app_provider';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Collapse, Typography } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../styles/sm_sidenav.css';
import { useSelector } from 'react-redux';

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

const SMSidenav = () => {
	const currentPath = usePathname();
	const router = useRouter();
	const [expanded, setExpanded] = useState<string[]>(['panel0', 'panel1', 'panel2']);
	const { logout } = useAppContext();
	const isMenuOpen: boolean = useSelector((state: any) => state.schoolManager.isMenuOpen);

	const handleLogout = async () => {
		await logout();
	};

	const handleNavigate = (url: string) => {
		// handle navigate
		router.push(url);
	};

	useEffect(() => {
		SM_SIDENAV.map((item, index) => {
			item.items.map((subItem) => {
				if (currentPath.startsWith(subItem.url)) {
					setExpanded((prev: string[]) => [...prev, `panel${index}`]);
				}
			});
		});
	}, [currentPath]);

	const toggleDropdown =
		(panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
			if (newExpanded) {
				setExpanded((prev: string[]) => [...prev, panel]);
			} else {
				setExpanded((prev: string[]) => prev.filter((item) => item !== panel));
			}
		};

	return (
		<Collapse
			in={!isMenuOpen}
			timeout={300}
			unmountOnExit
			orientation='horizontal'
			sx={{ width: '16vw', height: '100vh', margin: 0, padding: 0 }}
		>
			<div className='relative w-[16vw] h-full flex flex-col justify-start items-start gap-5 bg-white border-r-1 border-gray-400'>
				<div className='absolute top-0 left-0 z-10 bg-white w-full min-h-[50px] flex justify-center items-center border-b-1 border-gray-400'>
					<Link
						href={'/'}
						className='w-fit h-full text-primary-500 text-title-xl-strong font-bold'
					>
						Schedulify
					</Link>
				</div>
				<div className='w-full h-fit pb-[70px] pt-[50px] flex flex-col justify-start items-center overflow-y-scroll no-scrollbar'>
					{SM_SIDENAV.map((item: ISMSidenav, index: number) => (
						<Accordion
							key={item.category + index}
							expanded={expanded.includes(`panel${index}`)}
							onChange={toggleDropdown(`panel${index}`)}
							className='w-full p-0 m-0'
						>
							<AccordionSummary
								aria-controls={`panel${index}d-content`}
								id={`panel${index}d-header`}
								className='!text-primary-500 !bg-basic-gray-hover'
							>
								<Typography sx={{ userSelect: 'none' }}>{item.category}</Typography>
							</AccordionSummary>
							<AccordionDetails className='w-full !p-2'>
								{item.items.map((subItem: ISMNavigation) => (
									<div
										key={subItem.name}
										className={`w-[100%] h-fit flex flex-row justify-start items-center py-3 pl-4 pr-2 gap-3 rounded-[3px] hover:cursor-pointer 
									${currentPath.startsWith(subItem.url) ? 'bg-basic-gray-active ' : 'hover:bg-basic-gray-hover'}`}
										onClick={() => handleNavigate(subItem.url)}
									>
										<Image
											className='opacity-60'
											src={subItem.icon}
											alt='sidebar-icon'
											unoptimized={true}
											width={23}
											height={23}
										/>
										<p
											className={`text-body-medium font-normal select-none ${
												currentPath.startsWith(subItem.url)
													? ' !font-semibold'
													: ''
											}`}
										>
											{subItem.name}
										</p>
									</div>
								))}
							</AccordionDetails>
						</Accordion>
					))}
				</div>
				<div className='absolute bottom-0 right-0 w-full h-fit flex justify-center items-center bg-white py-3'>
					<button
						className='w-[60%] logout-btn text-center font-semibold text-body-medium'
						onClick={handleLogout}
					>
						ĐĂNG XUẤT
					</button>
				</div>
			</div>
		</Collapse>
	);
};

export default SMSidenav;
