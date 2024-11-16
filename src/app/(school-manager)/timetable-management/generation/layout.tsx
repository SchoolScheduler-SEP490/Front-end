'use client';
import SMHeader from '@/commons/school_manager/header';
import { IconButton } from '@mui/material';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import TimetableTabs from '../_components/timetable-tabs';
import { TIMETABLE_GENERATION_TABS } from '../_libs/constants';
import { useSelector } from 'react-redux';

interface TabPanelProps {
	children?: ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			className='w-full h-full overflow-y-hidden'
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <div className='w-full h-full overflow-y-hidden'>{children}</div>}
		</div>
	);
}

export default function SMLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const pathName = usePathname();
	const router = useRouter();
	const isMenuOpen: boolean = useSelector((state: any) => state.schoolManager.isMenuOpen);

	const [value, setValue] = useState(0);

	useEffect(() => {
		if (pathName.length > 0) {
			const currentTab: string = pathName.split('/')[pathName.split('/').length - 1];
			const tabIndex = TIMETABLE_GENERATION_TABS.findIndex((tab) => tab.value === currentTab);
			setValue(tabIndex);
		}
	}, [pathName]);

	return (
		<section
			className={`w-[${
				!isMenuOpen ? '84' : '100'
			}%] h-fit min-h-screen max-h-[100vh] flex flex-col justify-start items-start overflow-y-hidden`}
		>
			<SMHeader>
				<div className='flex flex-row justify-start items-center gap-2'>
					<IconButton color='info' onClick={() => router.back()}>
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
