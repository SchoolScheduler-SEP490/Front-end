'use client';

import { useAppContext } from '@/context/app_provider';
import useFilterArray from '@/hooks/useFilterArray';
import { CLASSGROUP_TRANSLATOR } from '@/utils/constants';
import {
	Paper,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useFetchClassGroupInformation from '../_hooks/useFetchClassGroup';
import useFetchCurriculumInformation from '../_hooks/useFetchCurriculum';
import { getFetchCurriculumDetailApi } from '../_libs/apis';
import {
	IClassGroupResponse,
	ICurriculumDetailResponse,
	ICurriculumResponse,
} from '../_libs/constant';

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
	specializedSubjects: string[];
	selectiveSubjects: string[];
	grade: string;
	appliedClassGroups: string[];
}

const CurriculumInformationTable = () => {
	const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
	const [detailedCurriculums, setDetailedCurriculums] = useState<ICurriculumDetailResponse[]>([]);
	const [curriculumInformation, setCurriculumInformation] = useState<
		ICurriculumInformationTableData[]
	>([]);

	const { data: curriculumData, mutate: updateCurriculum } = useFetchCurriculumInformation({
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
	// const { data: curriculumDetailedData, mutate: updateCurriculumDetail } =
	// 	useFetchCurriculumDetails({
	// 		schoolId: Number(schoolId),
	// 		schoolYearId: selectedSchoolYearId,
	// 		sessionToken,
	// 		curriculumId: selectedCurriculumId,
	// 	});

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
			var tmpCurriculumInformationArr: ICurriculumInformationTableData[] = [];
			detailedCurriculums.forEach((cur: ICurriculumDetailResponse) => {
				var tmpCurriculumInformation: ICurriculumInformationTableData = {
					curriculumName: cur['curriculum-name'],
					curriculumCode: cur['curriculum-code'],
					curriculumId: cur.id,
					specializedSubjects: useFilterArray(cur['subject-specializedt-views'], [
						'subject-id',
					]).map((sub) => sub['subject-name']),
					selectiveSubjects: useFilterArray(cur['subject-selective-views'], [
						'subject-id',
					]).map((sub) => sub['subject-name']),
					grade: cur.grade,
					appliedClassGroups: classGroupData.result.items.map(
						(classGroup: IClassGroupResponse) => {
							if (classGroup['curriculum-id'] === cur.id) {
								return classGroup['group-name'];
							} else return undefined;
						}
					),
				};
				tmpCurriculumInformationArr.push(tmpCurriculumInformation);
			});
			if (tmpCurriculumInformationArr.length > 0) {
				setCurriculumInformation(
					useFilterArray(tmpCurriculumInformationArr, ['curriculumId'])
				);
			}
		}
	}, [classGroupData, detailedCurriculums]);

	return (
		<div className='w-full h-[90vh] flex flex-col justify-start items-center px-[2vw] pt-[5vh] pb-[5vh] overflow-y-scroll no-scrollbar'>
			<Paper sx={{ mb: 2 }}>
				<TableContainer component={Paper}>
					<Table aria-label='curriculum table'>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>KCT</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Môn chuyên đề</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Môn tự chọn</TableCell>
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
												<Skeleton
													variant='text'
													animation='wave'
													width={150}
												/>
											</TableCell>
											<TableCell>
												<Skeleton
													variant='text'
													animation='wave'
													width={150}
												/>
											</TableCell>
											<TableCell>
												<Skeleton
													variant='text'
													animation='wave'
													width={150}
												/>
											</TableCell>
											<TableCell>
												<Skeleton
													variant='text'
													animation='wave'
													width={150}
												/>
											</TableCell>
											<TableCell width={80}>
												<p className='text-primary-400 underline'>
													Chi tiết
												</p>
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
										{getShortenedSubjects(row.specializedSubjects)}
									</TableCell>
									<TableCell>
										{getShortenedSubjects(row.selectiveSubjects)}
									</TableCell>
									<TableCell>Khối {CLASSGROUP_TRANSLATOR[row.grade]}</TableCell>
									<TableCell>{row.appliedClassGroups.join(' - ')}</TableCell>
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

export default CurriculumInformationTable;
