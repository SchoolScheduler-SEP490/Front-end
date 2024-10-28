'use client';

import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { SUBJECT_GROUP_TYPE, IPaginatedResponse } from '@/utils/constants';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { KeyedMutator, mutate } from 'swr';
import { getFetchSubjectApi } from '../../subject-management/_libs/apis';
import useCreateSubjectGroup from '../_hooks/useCreateSG';
import {
	ICreateSubjectGroupRequest,
	ICreateSubjectGroupResponse,
	IDropdownOption,
	ISubjectOptionResponse,
} from '../_libs/constants';
import { createSubjectGroupSchema } from '../_libs/subject_group_schema';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface IAddSubjectModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	subjectGroupMutator: KeyedMutator<any>;
}

const CreateSubjectGroupModal = (props: IAddSubjectModalProps) => {
	const { open, setOpen, subjectGroupMutator } = props;
	const { schoolId, sessionToken } = useAppContext();
	const [response, setResponse] = useState<ICreateSubjectGroupResponse | undefined>(
		undefined
	);
	const [requiredSubjects, setRequiredSubjects] = useState<IDropdownOption<number>[]>(
		[]
	);
	const [optionalSubjects, setOptionalSubjects] = useState<IDropdownOption<number>[]>(
		[]
	);

	const handleClose = () => {
		formik.handleReset;
		setOpen(false);
	};

	const handleFormSubmit = async (body: ICreateSubjectGroupRequest) => {
		setResponse(
			await useCreateSubjectGroup({
				formData: [
					{
						...body,
					} as ICreateSubjectGroupRequest,
				],
				schoolId: schoolId,
				sessionToken: sessionToken,
			})
		);
		subjectGroupMutator();
		handleClose();
	};

	const formik = useFormik({
		initialValues: {
			'group-name': '',
			'group-code': '',
			'group-description': '',
			grade: '',
			'school-year-id': 0,
			'elective-subject-ids': [],
			'specialized-subject-ids': [],
		} as ICreateSubjectGroupRequest,
		validationSchema: createSubjectGroupSchema,
		onSubmit: async (formData) => {
			// Add additional logic here
		},
	});

	const fetchRequiredData = async () => {
		const endpoint = getFetchSubjectApi({
			schoolId,
			pageIndex: 1,
			pageSize: 1000,
			isRequired: true,
		});
		const response = await mutate(endpoint);
		if (response.status !== 200) {
			useNotify({
				message: 'Lấy thông tin môn học thất bại',
				type: 'error',
			});
		} else {
			const data: IPaginatedResponse<ISubjectOptionResponse> =
				await response.json();
			const requiredSubjects = data.result.items.map((subject) => ({
				value: subject.id,
				label: subject['subject-name'],
			}));
			alert(JSON.stringify(data));
			setRequiredSubjects(requiredSubjects);
		}
	};

	const fetchOptionalData = async () => {
		const endpoint = getFetchSubjectApi({
			schoolId,
			pageIndex: 1,
			pageSize: 1000,
			isRequired: false,
		});
		const response = await mutate(endpoint);
		if (response.status !== 200) {
			useNotify({
				message: 'Lấy thông tin môn học thất bại',
				type: 'error',
			});
		} else {
			const data: IPaginatedResponse<ISubjectOptionResponse> =
				await response.json();
			const optionalSubjects = data.result.items.map((subject) => ({
				value: subject.id,
				label: subject['subject-name'],
			}));
			alert(JSON.stringify(data));
			setOptionalSubjects(optionalSubjects);
		}
	};

	useEffect(() => {});

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
						Thêm môn học
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
								Tên tổ hợp
							</h3>
							<TextField
								className='w-[70%]'
								variant='standard'
								label='Nhập tên tổ hợp'
								id='group-name'
								name='group-name'
								value={formik.values['group-name']}
								onChange={formik.handleChange('group-name')}
								onBlur={formik.handleBlur}
								error={
									formik.touched['group-name'] &&
									Boolean(formik.errors['group-name'])
								}
								helperText={
									formik.touched['group-name'] &&
									formik.errors['group-name']
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
							<h3 className=' h-full flex justify-start pt-4'>Mã tổ hợp</h3>
							<TextField
								className='w-[70%]'
								variant='standard'
								id='group-code'
								name='group-code'
								label='Nhập mã tổ hợp'
								value={formik.values['group-code']}
								onChange={formik.handleChange('group-code')}
								onBlur={formik.handleBlur}
								error={
									formik.touched['group-code'] &&
									Boolean(formik.errors['group-code'])
								}
								helperText={
									formik.touched['group-code'] &&
									formik.errors['group-code']
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
								id='group-description'
								name='group-description'
								label='Nhập mô tả tổ hợp'
								value={formik.values['group-description']}
								onChange={formik.handleChange('group-description')}
								onBlur={formik.handleBlur}
								error={
									formik.touched['group-description'] &&
									Boolean(formik.errors['group-description'])
								}
								helperText={
									formik.touched['group-description'] &&
									formik.errors['group-description']
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
							<h3 className=' h-full flex justify-start '>Môn tự chọn</h3>
							<TextField
								select
								className='w-[70%]'
								id='elective-subject-ids'
								name='elective-subject-ids'
								label='Chọn môn tự chọn'
								value={formik.values['elective-subject-ids']}
								onChange={formik.handleChange('elective-subject-ids')}
								onBlur={formik.handleBlur}
								slotProps={{
									select: {
										native: true,
									},
								}}
								error={
									formik.touched['elective-subject-ids'] &&
									Boolean(formik.errors['elective-subject-ids'])
								}
								helperText={
									formik.touched['elective-subject-ids'] &&
									formik.errors['elective-subject-ids']
								}
								variant='standard'
							>
								{optionalSubjects.map((option) => (
									<option key={option.value} value={option.label}>
										{option.label}
									</option>
								))}
							</TextField>
						</div>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start '>Môn chuyên đề</h3>
							<TextField
								select
								className='w-[70%]'
								id='specialized-subject-ids'
								name='specialized-subject-ids'
								label='Chọn chuyên đề'
								value={formik.values['specialized-subject-ids']}
								onChange={formik.handleChange('specialized-subject-ids')}
								onBlur={formik.handleBlur}
								slotProps={{
									select: {
										native: true,
									},
								}}
								error={
									formik.touched['specialized-subject-ids'] &&
									Boolean(formik.errors['specialized-subject-ids'])
								}
								helperText={
									formik.touched['specialized-subject-ids'] &&
									formik.errors['specialized-subject-ids']
								}
								variant='standard'
							>
								{optionalSubjects.map((option) => (
									<option key={option.value} value={option.label}>
										{option.label}
									</option>
								))}
							</TextField>
						</div>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start '>Khối áp dụng</h3>
							<TextField
								select
								className='w-[70%]'
								id='grade'
								name='grade'
								label='Chọn khối áp dụng'
								value={formik.values.grade}
								onChange={formik.handleChange('grade')}
								onBlur={formik.handleBlur}
								slotProps={{
									select: {
										native: true,
									},
								}}
								error={
									formik.touched.grade && Boolean(formik.errors.grade)
								}
								helperText={formik.touched.grade && formik.errors.grade}
								variant='standard'
							>
								{SUBJECT_GROUP_TYPE.map((option) => (
									<option key={option.value} value={option.key}>
										{option.key}
									</option>
								))}
							</TextField>
						</div>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start '>
								Năm học áp dụng
							</h3>
							<TextField
								select
								className='w-[70%]'
								id='school-year-id'
								name='school-year-id'
								label='Chọn năm học áp dụng'
								value={formik.values['school-year-id']}
								onChange={formik.handleChange('school-year-id')}
								onBlur={formik.handleBlur}
								slotProps={{
									select: {
										native: true,
									},
								}}
								error={
									formik.touched['school-year-id'] &&
									Boolean(formik.errors['school-year-id'])
								}
								helperText={
									formik.touched['school-year-id'] &&
									formik.errors['school-year-id']
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
							title='Thêm môn học'
							disableRipple
							type='submit'
							disabled={!formik.isValid}
							styles='bg-primary-300 text-white !py-1 px-4'
						/>
						<ContainedButton
							title='Huỷ'
							onClick={handleClose}
							disableRipple
							styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
						/>
					</div>
				</form>
			</Box>
		</Modal>
	);
};

export default CreateSubjectGroupModal;
