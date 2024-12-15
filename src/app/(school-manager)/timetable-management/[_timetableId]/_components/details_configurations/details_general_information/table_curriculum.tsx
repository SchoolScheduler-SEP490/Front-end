'use client';

import { useAppContext } from '@/context/app_provider';
import useFilterArray from '@/hooks/useFilterArray';
import { CLASSGROUP_TRANSLATOR } from '@/utils/constants';
import {
	Paper,
	Skeleton,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	tooltipClasses,
	TooltipProps,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useFetchClassGroupInformation from '../../../_hooks/useFetchClassGroup';
import useFetchCurriculumInformation from '../../../_hooks/useFetchCurriculum';
import { getFetchCurriculumDetailApi } from '../../../_libs/apis';
import {
	IClassGroupResponse,
	ICurriculumDetailResponse,
	ICurriculumResponse,
} from '../../../_libs/constants';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 11,
	},
}));

const getShortenedSubjects = (subject: string[]): string => {
	var resStr: string[] = [];
	subject.forEach((subject) => {
		if (subject.length > 5) {
			resStr.push(subject);
		} else {
			resStr.push(subject);
		}
	});

	return resStr.join(' - ');
};

interface ICurriculumInformationTableData {
	curriculumName: string;
	curriculumCode: string;
	curriculumId: number;
	subjects: string[];
	classes: string[];
	grade: string;
	appliedClassGroups: string[];
}

const DetailsCurriculumTable = () => {
	const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
	const [detailedCurriculums, setDetailedCurriculums] = useState<ICurriculumDetailResponse[]>([]);
	const [curriculumInformation, setCurriculumInformation] = useState<
		ICurriculumInformationTableData[]
	>([]);

	const { data: curriculumData } = useFetchCurriculumInformation({
		pageIndex: 1,
		pageSize: 1000,
		schoolId: schoolId,
		schoolYearId: selectedSchoolYearId,
		sessionToken,
	});
	const {
		data: classGroupData,
		mutate: updateClassGroup,
		isValidating: isClassGroupValidating,
	} = useFetchClassGroupInformation({
		pageIndex: 1,
		pageSize: 1000,
		schoolId: Number(schoolId),
		schoolYearId: selectedSchoolYearId,
		sessionToken,
	});

	useEffect(() => {
		setDetailedCurriculums([]);
		const fetchCurriculumDetails = async () => {
			if (curriculumData?.status === 200) {
				curriculumData.result.items.forEach(async (cur: ICurriculumResponse) => {
					const endpoint: string = getFetchCurriculumDetailApi({
						subjectGroupId: cur.id,
						schoolId: Number(schoolId),
						schoolYearId: selectedSchoolYearId,
					});
					const res = await fetch(endpoint, {
						method: 'GET',
						headers: {
							Authorization: `Bearer ${sessionToken}`,
						},
					});
					if (res.ok) {
						const data = await res.json();
						setDetailedCurriculums((prev) => [...prev, data.result]);
					}
				});
			}
		};

		fetchCurriculumDetails();
	}, [curriculumData]);

	useEffect(() => {
		updateClassGroup();
		setCurriculumInformation([]);
		if (detailedCurriculums.length > 0 && classGroupData?.status === 200) {
			let tmpCurriculumInformationArr: ICurriculumInformationTableData[] = [];
			detailedCurriculums.forEach((cur: ICurriculumDetailResponse) => {
				let classGroups: string[] = [];
				let appliedClasses:string[] = []
				classGroupData.result.items.map((classGroup: IClassGroupResponse) => {
					if (classGroup['curriculum-id'] === cur.id && classGroup.classes.length > 0) {
						classGroups.push(classGroup['group-name']);
						appliedClasses.push(...classGroup.classes.map((cls) => cls.name))
					}
				});
				let tmpCurriculumInformation: ICurriculumInformationTableData = {
					curriculumName: cur['curriculum-name'],
					curriculumCode: cur['curriculum-code'],
					curriculumId: cur.id,
					subjects: useFilterArray([...cur['subject-specializedt-views'],...cur['subject-selective-views']], [
						'subject-id',
					]).map((sub) => sub['subject-name']),
					classes: appliedClasses,
					grade: cur.grade,
					appliedClassGroups: classGroups,
				};
				tmpCurriculumInformationArr.push(tmpCurriculumInformation);
			});
			if (tmpCurriculumInformationArr.length > 0) {
				setCurriculumInformation(
					useFilterArray(
						tmpCurriculumInformationArr.filter((item) => item.appliedClassGroups.length !== 0),
						['curriculumId']
					).sort((a, b) => a.grade.localeCompare(b.grade))
				);
			}
		}
	}, [classGroupData, detailedCurriculums]);

	return (
		<div className='w-full h-[85vh] flex flex-col justify-start items-center px-[2vw] pt-[5vh] pb-[5vh] overflow-y-scroll no-scrollbar'>
			<Paper sx={{ mb: 2 }}>
				<TableContainer component={Paper}>
					<Table aria-label='curriculum table' size='small'>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>KCT</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>
									<LightTooltip title={'Môn tự chọn và môn chuyên đề'}>
										<Typography sx={{ fontSize: 13, fontWeight: 'bold' }}>Môn TC&CĐ</Typography>
									</LightTooltip>
								</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Lớp áp dụng</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Khối</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Nhóm lớp</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{isClassGroupValidating && curriculumInformation.length === 0 && (
								<>
									{[1, 2, 3, 4, 5].map((index) => (
										<TableRow key={index}>
											<TableCell width={50} sx={{ textAlign: 'center' }}>
												<Skeleton variant='text' animation='wave' />
											</TableCell>
											<TableCell>
												<Skeleton variant='text' animation='wave' />
											</TableCell>
											<TableCell>
												<Skeleton variant='text' animation='wave' width={150} />
											</TableCell>
											<TableCell>
												<Skeleton variant='text' animation='wave' width={150} />
											</TableCell>
											<TableCell>
												<Skeleton variant='text' animation='wave' width={150} />
											</TableCell>
											<TableCell>
												<Skeleton variant='text' animation='wave' width={150} />
											</TableCell>
											<TableCell width={80}>
												<p className='text-primary-400 underline'>Chi tiết</p>
											</TableCell>
										</TableRow>
									))}
								</>
							)}
							{curriculumInformation.map((row, index) => (
								<TableRow key={index}>
									<TableCell width={50} sx={{ textAlign: 'center' }}>
										{index + 1}
									</TableCell>
									<TableCell>{row.curriculumName}</TableCell>
									<TableCell>
										{getShortenedSubjects([...row.subjects])}
									</TableCell>
									<TableCell width={200}>{row.classes.join('-')}</TableCell>
									<TableCell width={80}>Khối {CLASSGROUP_TRANSLATOR[row.grade]}</TableCell>
									<TableCell>{row.appliedClassGroups.join(' | ')}</TableCell>
									<TableCell width={80}>
										<a
											href={`/curiculumn-management/${row.curriculumId}`}
											target='_blank'
											rel='noopener noreferrer'
											className='text-primary-400 underline'
										>
											Chi tiết
										</a>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</div>
	);
};

export default DetailsCurriculumTable;
