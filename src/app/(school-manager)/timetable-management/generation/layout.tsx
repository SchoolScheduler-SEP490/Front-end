'use client';
import { ReactNode, useEffect, useState } from 'react';
import TimetableTabs from '../_components/timetable-tabs';
import { Box, IconButton } from '@mui/material';
import { usePathname } from 'next/navigation';
import { TIMETABLE_GENERATION_TABS } from '../_libs/constants';
import SMHeader from '@/commons/school_manager/header';
import Image from 'next/image';

interface TabPanelProps {
	children?: ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			className='w-full h-fit'
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <div className='w-full h-fit'>{children}</div>}
		</div>
	);
}

export default function SMLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const pathName = usePathname();
	const [value, setValue] = useState(0);

	useEffect(() => {
		if (pathName.length > 0) {
			const currentTab: string = pathName.split('/')[pathName.split('/').length - 1];
			const tabIndex = TIMETABLE_GENERATION_TABS.findIndex((tab) => tab.value === currentTab);
			setValue(tabIndex);
		}
	}, [pathName]);

	return (
		<section className='w-[84%] h-fit min-h-screen flex flex-col justify-start items-start overflow-y-hidden'>
			<SMHeader>
				<div className='flex flex-row justify-start items-center gap-2'>
					<IconButton color='info'>
						<Image
							src='/images/icons/arrow.png'
							alt='Trở lại'
							width={20}
							height={20}
							unoptimized={true}
						/>
					</IconButton>
					<h3 className='text-title-small text-white font-medium tracking-wider'>
						Tạo thời khóa biểu
					</h3>
				</div>
			</SMHeader>
			<TimetableTabs />
			<CustomTabPanel value={value} index={value}>
				{children}
			</CustomTabPanel>
		</section>
	);
}
