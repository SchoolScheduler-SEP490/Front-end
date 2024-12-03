'use client';
import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import { IconButton } from '@mui/material';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import UpdateCurriculumModal from '../_components/curiculumn_modal_update';
import useFetchCurriculumDetails from '../_hooks/useFetchCuriculumnDetail';
import { ICurriculumDetailResponse } from '../_libs/constants';
import CurriculumDetails from './_components/curriculum_details';
import CurriculumDetailsSidenav from './_components/curriculum_sidenav';
import CurriculumLesson from './_components/curriculum_lessons';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			className='w-full h-full'
			role='tabpanel'
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && (
				<div className='w-full h-full pt-[5vh] flex flex-col justify-start items-center'>
					{children}
				</div>
			)}
		</div>
	);
}

export default function CurriculumDetailsPage() {
	const curriculumId = useParams().curriculumId;
	const router = useRouter();
	const isMenuOpen: boolean = useSelector((state: any) => state.schoolManager.isMenuOpen);

	const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();
	const [curriculumDetails, setCurriculumDetails] = useState<ICurriculumDetailResponse | null>(
		null
	);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

	const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

	const { data, mutate } = useFetchCurriculumDetails({
		sessionToken,
		subjectGroupId: Number(curriculumId as string),
		schoolId: Number(schoolId),
		schoolYearId: selectedSchoolYearId,
	});

	const handleUpdateCurriculum = () => {
		setIsUpdateModalOpen(true);
	};

	useEffect(() => {
		if (data?.status === 200) {
			setCurriculumDetails(data?.result);
		}
	}, [data]);

	useEffect(() => {
		mutate({ subjectGroupId: curriculumId });
	}, [curriculumId]);

	return (
		<div className={`w-[${!isMenuOpen ? '84' : '100'}%] h-screen overflow-y-hidden`}>
			<SMHeader>
				<div className='w-fit h-full flex flex-row justify-start items-center gap-2'>
					<IconButton color='info' onClick={() => router.back()}>
						<Image
							src='/images/icons/arrow.png'
							alt='Trở lại'
							width={15}
							height={15}
							unoptimized={true}
						/>
					</IconButton>
					<h3 className='text-title-small text-white font-medium tracking-wider'>
						Thông tin chi tiết
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-full flex flex-row justify-start items-center'>
				<CurriculumDetailsSidenav value={selectedTabIndex} setValue={setSelectedTabIndex} />
				<TabPanel value={selectedTabIndex} index={0}>
					<CurriculumDetails
						handleUpdateCurriculum={handleUpdateCurriculum}
						subjectGroupDetails={curriculumDetails}
					/>
				</TabPanel>
				<TabPanel value={selectedTabIndex} index={1}>
					<CurriculumLesson />
				</TabPanel>
			</div>
			<UpdateCurriculumModal
				open={isUpdateModalOpen}
				setOpen={setIsUpdateModalOpen}
				subjectGroupId={Number(curriculumId as string)}
				subjectGroupMutator={mutate}
			/>
		</div>
	);
}
