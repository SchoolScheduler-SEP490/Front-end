'use client';

import { ITimetableGenerationState, setDataStored } from '@/context/slice_timetable_generation';
import { firestore } from '@/utils/firebaseConfig';
import { Button, TextField } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { IConfigurationStoreObject } from '@/utils/constants';
import useNotify from '@/hooks/useNotify';

export default function Home() {
	const { dataStored, dataFirestoreName }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);
	const dispatch = useDispatch();

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
				.min(4, 'Phải học ít nhất 4 ngày/tuần')
				.max(6, 'Không thể học quá 6 ngày/tuần'),
			'required-break-periods': yup
				.number()
				.required('Vui lòng nhập khoảng nghỉ giữa 2 buổi')
				.min(1, 'Phải có ít nhất 1 khoảng nghỉ')
				.max(3, 'Khoảng nghỉ không được kéo dài quá 3 tiết'),
			'minimum-days-off': yup.number(),
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
		}
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
					value={formik.values['required-break-periods']}
					onChange={formik.handleChange('required-break-periods')}
					onBlur={formik.handleBlur}
					error={
						formik.touched['required-break-periods'] &&
						Boolean(formik.errors['required-break-periods'])
					}
					helperText={
						formik.touched['required-break-periods'] &&
						formik.errors['required-break-periods']
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
					value={formik.values['minimum-days-off']}
					onChange={formik.handleChange('minimum-days-off')}
					onBlur={formik.handleBlur}
					error={
						formik.touched['minimum-days-off'] &&
						Boolean(formik.errors['minimum-days-off'])
					}
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
				<Button
					variant='contained'
					fullWidth
					disabled={!formik.isValid}
					onClick={handleUpdateGeneralConfigurations}
					color='inherit'
					sx={{
						bgcolor: '#175b8e',
						color: 'white',
						borderRadius: 0,
						marginTop: '2vh',
					}}
				>
					Lưu thay đổi
				</Button>
			</div>
		</div>
	);
}
