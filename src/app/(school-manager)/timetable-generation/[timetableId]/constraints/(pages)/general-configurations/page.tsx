'use client';

import { ITimetableGenerationState, setDataStored } from '@/context/slice_timetable_generation';
import useNotify from '@/hooks/useNotify';
import { IConfigurationStoreObject } from '@/utils/constants';
import { firestore } from '@/utils/firebaseConfig';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, Collapse, TextField } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { useFormik } from 'formik';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import useFetchCurriculumInformation from './_hooks/useFetchCurriculum';
import { useAppContext } from '@/context/app_provider';
import { ICurriculumDetailResponse, ICurriculumResponse, ISubjectInGroup } from './_libs/constant';
import { getFetchCurriculumDetailApi } from './_libs/apis';
import useFilterArray from '@/hooks/useFilterArray';

export default function GeneralConfiguration() {
	const { schoolId, selectedSchoolYearId, sessionToken } = useAppContext();
	const { dataStored, dataFirestoreName }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);
	const dispatch = useDispatch();
	const router = useRouter();
	const pathName = usePathname();

	const [isCompleted, setIsCompleted] = useState<boolean>(false);
	const [detailedCurriculums, setDetailedCurriculums] = useState<ICurriculumDetailResponse[]>([]);

	const { data: curriculumData, mutate: updateCurriculum } = useFetchCurriculumInformation({
		pageIndex: 1,
		pageSize: 1000,
		schoolId: schoolId,
		schoolYearId: selectedSchoolYearId,
		sessionToken,
	});

	useEffect(() => {
		const fetchCurriculumDetails = async () => {
			if (curriculumData?.status === 200) {
				setDetailedCurriculums([]);
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
						if ((data.result as ICurriculumDetailResponse)['student-class-group-view-names'].length > 0) {
							setDetailedCurriculums((prev) => [...prev, data.result]);
						}
					}
				});
			}
		};

		fetchCurriculumDetails();
	}, [curriculumData]);

	const minDaysOff:number =  useMemo(():number => {
		let tmpMaxMainSlotPerWeek = 0;
		if (detailedCurriculums.length > 0) {
			detailedCurriculums.forEach((cur) => {
				const subjectList: ISubjectInGroup[] = useFilterArray(
					[
						...cur['subject-required-views'],
						...cur['subject-selective-views'],
						...cur['subject-specializedt-views'],
					],
					['subject-id']
				);
				// lấy ra tổng số lượng tiết của buổi chính khóa/tuần
				let totalMainSlotPerWeek = 0;
				subjectList.forEach((subject) => (totalMainSlotPerWeek += subject['main-slot-per-week']));
				const tmpDayOff = totalMainSlotPerWeek % 5 > 0 ? Math.floor(totalMainSlotPerWeek / 5) + 1 :Math.floor(totalMainSlotPerWeek / 5)
				if (tmpDayOff > tmpMaxMainSlotPerWeek) {
					tmpMaxMainSlotPerWeek = tmpDayOff;
				}
			});
		}
		return tmpMaxMainSlotPerWeek;
	}, [detailedCurriculums]);

	useEffect(() => {
		if (dataStored) {
			formik.setValues(
				{
					'days-in-week': dataStored['days-in-week'],
					'minimum-days-off': dataStored['minimum-days-off'],
					'required-break-periods': dataStored['required-break-periods'],
				},
				true
			);
		}
	}, [dataStored]);

	const formik = useFormik({
		initialValues: {
			'days-in-week': 6,
			'required-break-periods': 1,
			'minimum-days-off': 0,
		},
		onSubmit: (values) => {},
		validationSchema: yup.object().shape({
			'days-in-week': yup
				.number()
				.required('Vui lòng nhập số ngày học trong tuần')
				.min(minDaysOff, `Phải học ít nhất ${minDaysOff} ngày/tuần`)
				.max(6, 'Không thể học quá 6 ngày/tuần'),
			'required-break-periods': yup
				.number()
				.required('Vui lòng nhập khoảng nghỉ giữa 2 buổi')
				.min(1, 'Phải có ít nhất 1 khoảng nghỉ')
				.max(3, 'Khoảng nghỉ không được kéo dài quá 3 tiết'),
			'minimum-days-off': yup.number().min(0, 'Số ngày nghỉ không được âm'),
		}),
	});

	const handleClearData = () => {
		formik.setValues({
			'days-in-week': dataStored['days-in-week'],
			'minimum-days-off': dataStored['minimum-days-off'],
			'required-break-periods': dataStored['required-break-periods'],
		});
	};

	const handleUpdateGeneralConfigurations = async () => {
		if (dataStored && dataFirestoreName && dataStored.id) {
			const docRef = doc(firestore, dataFirestoreName, dataStored.id);
			await setDoc(
				docRef,
				{
					...dataStored,
					'days-in-week': formik.values['days-in-week'],
					'required-break-periods': formik.values['required-break-periods'],
					'minimum-days-off': formik.values['minimum-days-off'],
				} as IConfigurationStoreObject,
				{ merge: true }
			);
			dispatch(
				setDataStored({
					...dataStored,
					'days-in-week': formik.values['days-in-week'],
					'required-break-periods': formik.values['required-break-periods'],
					'minimum-days-off': formik.values['minimum-days-off'],
				})
			);
			useNotify({
				message: 'Cập nhật cấu hình chung thành công',
				type: 'success',
			});
			handleClearData();
			setIsCompleted(true);
		}
	};

	const handleNext = () => {
		const tmpPathArr: string[] = pathName.split('/');
		tmpPathArr.splice(4);
		tmpPathArr.push('teacher-unavailability');
		router.push(tmpPathArr.join('/'));
	};

	return (
		<div className='w-full h-screen flex flex-col justify-start items-center pt-[15vh]'>
			<div className='w-[30vw] h-[40vh] flex flex-col justify-start items-center gap-3'>
				<h1 className='w-full text-center text-title-medium-strong mb-2'>Cấu hình chung</h1>
				<TextField
					fullWidth
					variant='standard'
					id='days-in-week'
					name='days-in-week'
					type='number'
					label='Số ngày học trong tuần'
					onFocus={(event) => event.target.select()}
					value={formik.values['days-in-week']}
					onChange={formik.handleChange('days-in-week')}
					onBlur={formik.handleBlur}
					error={formik.touched['days-in-week'] && Boolean(formik.errors['days-in-week'])}
					helperText={formik.touched['days-in-week'] && formik.errors['days-in-week']}
					slotProps={{
						input: {
							endAdornment: (
								<Image
									className='opacity-30 mx-2 select-none'
									src='/images/icons/pin.png'
									alt='email'
									width={20}
									height={20}
								/>
							),
						},
					}}
				/>
				<TextField
					fullWidth
					variant='standard'
					id='required-break-periods'
					name='required-break-periods'
					type='number'
					label='Khoảng nghỉ giữa 2 buổi'
					onFocus={(event) => event.target.select()}
					value={formik.values['required-break-periods']}
					onChange={formik.handleChange('required-break-periods')}
					onBlur={formik.handleBlur}
					error={
						formik.touched['required-break-periods'] &&
						Boolean(formik.errors['required-break-periods'])
					}
					helperText={
						formik.touched['required-break-periods'] && formik.errors['required-break-periods']
					}
					slotProps={{
						input: {
							endAdornment: (
								<Image
									className='opacity-30 mx-2 select-none'
									src='/images/icons/pin.png'
									alt='email'
									width={20}
									height={20}
								/>
							),
						},
					}}
				/>
				<TextField
					fullWidth
					variant='standard'
					id='minimum-days-off'
					name='minimum-days-off'
					type='number'
					label='Số ngày nghỉ tối thiểu của giáo viên'
					onFocus={(event) => event.target.select()}
					value={formik.values['minimum-days-off']}
					onChange={formik.handleChange('minimum-days-off')}
					onBlur={formik.handleBlur}
					error={formik.touched['minimum-days-off'] && Boolean(formik.errors['minimum-days-off'])}
					helperText={
						formik.touched['minimum-days-off'] && formik.errors['minimum-days-off']
							? formik.errors['minimum-days-off']
							: 'Nhập giá trị phù hợp (1-2 buổi) nhằm đảm bảo việc xếp TKB khả thi'
					}
					slotProps={{
						input: {
							endAdornment: (
								<Image
									className='opacity-30 mx-2 select-none'
									src='/images/icons/pin.png'
									alt='email'
									width={20}
									height={20}
								/>
							),
						},
					}}
				/>
				<div className={`w-full h-fit flex flex-row justify-between items-center `}>
					<Button
						variant='contained'
						disabled={!formik.isValid}
						onClick={handleUpdateGeneralConfigurations}
						color='inherit'
						sx={{
							bgcolor: '#175b8e',
							color: 'white',
							borderRadius: 0,
							width: isCompleted ? '50%' : '100%',
						}}
					>
						Lưu thay đổi
					</Button>
					<Collapse
						in={isCompleted}
						orientation='horizontal'
						sx={{
							width: isCompleted ? '60%' : '0%',
							height: 'fit-content',
							p: 0,
							m: 0,
						}}
					>
						<Button
							variant='contained'
							disabled={!formik.isValid}
							onClick={handleNext}
							color='success'
							sx={{
								borderRadius: 0,
								width: '100%',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								textWrap: 'nowrap',
							}}
							endIcon={<ArrowForwardIcon />}
						>
							Bước tiếp theo
						</Button>
					</Collapse>
				</div>
			</div>
		</div>
	);
}
