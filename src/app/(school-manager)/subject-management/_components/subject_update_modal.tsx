'use client';

import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { ICommonResponse, SUBJECT_GROUP_TYPE } from '@/utils/constants';
import CloseIcon from '@mui/icons-material/Close';
import {
	Box,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	Modal,
	Radio,
	RadioGroup,
	TextField,
	Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import {
	IAddSubjectRequestBody,
	ICreateSubjectResponse,
	ISubject,
} from '../../_utils/contants';
import useUpdateSubject from '../_hooks/useUpdateSubject';
import { addSubjectSchema } from '../_libs/subject_schema';

const style = {
	position: 'absolute',
	top: '40%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface IUpdateSubjectModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	subjectId: number;
	mutate: KeyedMutator<any>;
}

const UpdateSubjectModal = (props: IUpdateSubjectModalProps) => {
	const { open, setOpen, subjectId, mutate } = props;
	const { sessionToken } = useAppContext();
	const api = process.env.NEXT_PUBLIC_API_URL;

	const [response, setResponse] = useState<ICreateSubjectResponse | undefined>(
		undefined
	);
	const [oldData, setOldData] = useState<IAddSubjectRequestBody>(
		{} as IAddSubjectRequestBody
	);

	const handleClose = () => {
		formik.handleReset;
		setOpen(false);
	};

	useEffect(() => {
		const fetchSubjectDetail = async () => {
			const response = await fetch(`${api}/api/subjects/${subjectId}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${sessionToken}`,
				},
			});
			const data: ICommonResponse<ISubject> = await response.json();
			if (data.status !== 200) {
				useNotify({
					type: 'error',
					message: data.message,
				});
			} else {
				setOldData({
					'subject-name': data.result['subject-name'],
					abbreviation: data.result.abbreviation,
					description: data.result.description,
					'is-required': data.result['is-required'],
					'subject-group-type': data.result['subject-group-type'],
				});
			}
		};
		if (open) {
			fetchSubjectDetail();
		}
	}, [open]);

	useEffect(() => {
		formik.setValues({
			'subject-name': oldData ? oldData['subject-name'] || '' : '',
			abbreviation: oldData ? oldData.abbreviation || '' : '',
			description: oldData ? oldData.description || '' : '',
			'is-required': oldData ? oldData['is-required'] || false : false,
			'subject-group-type': oldData ? oldData['subject-group-type'] || '' : '',
		});
	}, [oldData]);

	const handleFormSubmit = async (body: IAddSubjectRequestBody) => {
		setResponse(
			await useUpdateSubject({
				formData: {
					...body,
					'is-required':
						body['is-required'].toString() === 'true' ? true : false,
				},
				subjectId: subjectId,
				sessionToken: sessionToken,
			})
		);
		mutate();
		handleClose();
	};

	const formik = useFormik({
		initialValues: {
			'subject-name': '',
			abbreviation: '',
			description: '',
			'is-required': false,
			'subject-group-type': '',
		},
		validationSchema: addSubjectSchema,
		onSubmit: async (formData) => {
			// Add additional logic here
		},
	});

	return (
		<Modal
			keepMounted
			open={open}
			onClose={handleClose}
			aria-labelledby='keep-mounted-modal-title'
			aria-describedby='keep-mounted-modal-description'
		>
			<Box sx={style}>
				<div
					id='modal-header'
					className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-medium-strong font-normal opacity-60'
					>
						Cập nhật thông tin môn học
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<form
					onSubmit={(event: any) => {
						event.preventDefault();
						handleFormSubmit(formik.values);
					}}
					className='w-full h-fit flex flex-col justify-start items-center'
				>
					<div className='w-full p-3 flex flex-col justify-start items-center gap-3'>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start pt-4'>
								Tên môn học
							</h3>
							<TextField
								className='w-[70%]'
								variant='standard'
								label='Nhập tên môn học'
								id='subject-name'
								name='subject-name'
								value={formik.values['subject-name']}
								onChange={formik.handleChange('subject-name')}
								onBlur={formik.handleBlur}
								error={
									formik.touched['subject-name'] &&
									Boolean(formik.errors['subject-name'])
								}
								helperText={
									formik.touched['subject-name'] &&
									formik.errors['subject-name']
								}
								slotProps={{
									input: {
										endAdornment: (
											<Image
												className='opacity-30 mx-2 select-none'
												src='/images/icons/text-formatting.png'
												alt='email'
												width={20}
												height={20}
											/>
										),
									},
								}}
							/>
						</div>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start pt-4'>
								Tên tắt TKB
							</h3>
							<TextField
								className='w-[70%]'
								variant='standard'
								id='abbreviation'
								name='abbreviation'
								label='Nhập tên viết tắt TKB'
								value={formik.values.abbreviation}
								onChange={formik.handleChange('abbreviation')}
								onBlur={formik.handleBlur}
								error={
									formik.touched.abbreviation &&
									Boolean(formik.errors.abbreviation)
								}
								helperText={
									formik.touched.abbreviation &&
									formik.errors.abbreviation
								}
								slotProps={{
									input: {
										endAdornment: (
											<Image
												className='opacity-30 mx-2 select-none'
												src='/images/icons/text-formatting.png'
												alt='email'
												width={20}
												height={20}
											/>
										),
									},
								}}
							/>
						</div>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start pt-4'>Mô tả</h3>
							<TextField
								className='w-[70%]'
								variant='standard'
								id='description'
								name='description'
								label='Nhập mô tả môn học'
								value={formik.values.description}
								onChange={formik.handleChange('description')}
								onBlur={formik.handleBlur}
								error={
									formik.touched.description &&
									Boolean(formik.errors.description)
								}
								helperText={
									formik.touched.description &&
									formik.errors.description
								}
								slotProps={{
									input: {
										endAdornment: (
											<Image
												className='opacity-30 mx-2 select-none'
												src='/images/icons/text-formatting.png'
												alt='email'
												width={20}
												height={20}
											/>
										),
									},
								}}
							/>
						</div>
						<FormControl className='w-full flex flex-row justify-between items-center'>
							<FormLabel
								id='subject-radio-buttons-group-label'
								className='!text-black'
							>
								Loại môn học
							</FormLabel>
							<RadioGroup
								className='w-[70%] flex flex-row justify-start items-center'
								aria-labelledby='subject-radio-buttons-group-label'
								defaultValue={formik.values['is-required']}
								name='is-required'
								id='is-required'
								onChange={formik.handleChange('is-required')}
							>
								<FormControlLabel
									value={true}
									control={<Radio />}
									label='Bắt buộc'
								/>
								<FormControlLabel
									value={false}
									control={<Radio />}
									label='Tự chọn'
								/>
							</RadioGroup>
						</FormControl>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start '>Mô tả</h3>
							<TextField
								select
								className='w-[70%]'
								id='subject-group-type'
								name='subject-group-type'
								label='Nhập loại môn học'
								value={formik.values['subject-group-type']}
								onChange={formik.handleChange('subject-group-type')}
								onBlur={formik.handleBlur}
								slotProps={{
									select: {
										native: true,
									},
								}}
								error={
									formik.touched['subject-group-type'] &&
									Boolean(formik.errors['subject-group-type'])
								}
								helperText={
									formik.touched['subject-group-type'] &&
									formik.errors['subject-group-type']
								}
								variant='standard'
							>
								{SUBJECT_GROUP_TYPE.map((option) => (
									<option key={option.value} value={option.key}>
										{option.key}
									</option>
								))}
							</TextField>
						</div>
					</div>
					<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
						<ContainedButton
							title='Cập nhật'
							disableRipple
							type='submit'
							disabled={!formik.isValid}
							styles='bg-primary-300 text-white !py-1 px-4'
						/>
						<ContainedButton
							title='Huỷ'
							onClick={handleClose}
							disableRipple
							styles='bg-basic-gray-active text-basic-gray !py-1 px-4'
						/>
					</div>
				</form>
			</Box>
		</Modal>
	);
};

export default UpdateSubjectModal;
