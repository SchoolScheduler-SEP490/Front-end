'use client';

import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { CLASSGROUP_STRING_TYPE } from '@/utils/constants';
import { TRANSLATOR } from '@/utils/dictionary';
import CloseIcon from '@mui/icons-material/Close';
import {
	Box,
	FormControl,
	FormHelperText,
	IconButton,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import useFetchSchoolYear from '../_hooks/useFetchSchoolYear';
import useFetchSGDetail from '../_hooks/useFetchSGDetail';
import useFetchSubjectOptions from '../_hooks/useFetchSubjectOptions';
import useUpdateSubjectGroup from '../_hooks/useUpdateSG';
import {
	IDropdownOption,
	ISchoolYearResponse,
	ISubjectGroupDetailResponse,
	ISubjectOptionResponse,
	IUpdateSubjectGroupRequest,
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
			scrollbars: 'none',
		},
	},
};
function getStyles(
	selected: IDropdownOption<number>,
	personName: IDropdownOption<number>[],
	theme: Theme
) {
	return {
		fontWeight: personName.includes(selected)
			? theme.typography.fontWeightMedium
			: theme.typography.fontWeightRegular,
	};
}

interface IAddSubjectModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	subjectGroupId: number;
	subjectGroupMutator: KeyedMutator<any>;
}

const UpdateSubjectGroupModal = (props: IAddSubjectModalProps) => {
	const { open, setOpen, subjectGroupId, subjectGroupMutator } = props;
	const theme = useTheme();
	const { schoolId, sessionToken } = useAppContext();
	const [specialisedSubjects, setSpecialisedSubjects] = useState<
		IDropdownOption<number>[]
	>([]);
	const [optionalSubjects, setOptionalSubjects] = useState<IDropdownOption<number>[]>(
		[]
	);
	const [schoolYearOptions, setSchoolYearOptions] = useState<IDropdownOption<number>[]>(
		[]
	);
	const [oldData, setOldData] = useState<ISubjectGroupDetailResponse | undefined>(
		undefined
	);

	// Fetch data
	const { data: requiredSubjectsData, error: requiredError } = useFetchSubjectOptions({
		sessionToken: sessionToken,
		schoolId: schoolId,
		isRequired: true,
	});
	const { data: optionalSubjectsData, error: optionalError } = useFetchSubjectOptions({
		sessionToken: sessionToken,
		schoolId: schoolId,
		isRequired: false,
	});
	const { data: schoolYearData, error: schoolYearError } = useFetchSchoolYear();
	const { data: subjectGroupDetailData, error: subjectGroupDetailError } =
		useFetchSGDetail({
			sessionToken: sessionToken,
			subjectGroupId: subjectGroupId,
		});

	const handleClose = () => {
		formik.handleReset(formik.initialValues);
		setOpen(false);
	};

	const handleFormSubmit = async (body: IUpdateSubjectGroupRequest) => {
		await useUpdateSubjectGroup({
			formData: {
				...body,
				'is-deleted': false,
			} as IUpdateSubjectGroupRequest,
			sessionToken: sessionToken,
			subjectGroupId: subjectGroupId,
		});
		subjectGroupMutator();
		handleClose();
	};

	const formik = useFormik({
		initialValues: {
			'group-name': '',
			'group-code': '',
			'group-description': '',
			grade: 0,
			'school-year-id': 0,
			'elective-subject-ids': [],
			'specialized-subject-ids': [],
		} as IUpdateSubjectGroupRequest,
		validationSchema: createSubjectGroupSchema,
		onSubmit: async (formData) => {
			// Add additional logic here
		},
		validateOnMount: true,
	});

	useEffect(() => {
		if (optionalError || requiredError || schoolYearError) {
			useNotify({
				type: 'error',
				message:
					TRANSLATOR[optionalError?.message || requiredError?.message || ''] ??
					'Có lỗi xảy ra khi tải dữ liệu Tổ hợp',
			});
		}
		if (requiredSubjectsData?.status === 200) {
			const requiredSubjects: IDropdownOption<number>[] =
				requiredSubjectsData.result.items.map(
					(subject: ISubjectOptionResponse) => ({
						label: subject['subject-name'],
						value: subject.id,
					})
				);
			setSpecialisedSubjects(requiredSubjects);
		}
		if (optionalSubjectsData?.status === 200) {
			const optionalSubjects: IDropdownOption<number>[] =
				optionalSubjectsData.result.items.map(
					(subject: ISubjectOptionResponse) => ({
						label: subject['subject-name'],
						value: subject.id,
					})
				);
			setOptionalSubjects(optionalSubjects);
		}
		if (schoolYearData?.status === 200) {
			const schoolYears: IDropdownOption<number>[] = schoolYearData.result.map(
				(year: ISchoolYearResponse) => ({
					label: `${year['start-year']} - ${year['end-year']}`,
					value: year.id,
				})
			);
			setSchoolYearOptions(schoolYears);
		}
		if (subjectGroupDetailData?.status === 200) {
			setOldData({ ...subjectGroupDetailData?.result });
		}
	}, [
		requiredSubjectsData,
		optionalSubjectsData,
		schoolYearData,
		subjectGroupDetailData,
	]);

	useEffect(() => {
		if (formik.values['elective-subject-ids'].length > 0) {
			const selectedSubjects: IDropdownOption<number>[] = optionalSubjects.filter(
				(subject) => formik.values['elective-subject-ids'].includes(subject.value)
			);
			if (requiredSubjectsData?.result.items ?? false) {
				const initialData: IDropdownOption<number>[] =
					requiredSubjectsData.result.items.map(
						(subject: ISubjectOptionResponse) => ({
							label: subject['subject-name'],
							value: subject.id,
						})
					);
				setSpecialisedSubjects([...initialData, ...selectedSubjects]);
			}
		}
	}, [formik.values['elective-subject-ids']]);

	useEffect(() => {
		if (oldData) {
			const electiveSubjectIds: Set<number> = new Set<number>();
			const specialisedSubjectIds: Set<number> = new Set<number>();
			oldData['subject-selective-views']?.map((item) => {
				const selectedId =
					optionalSubjects.find(
						(subject) => subject.label === item['subject-name']
					)?.value ?? 0;
				if (selectedId !== 0) electiveSubjectIds.add(selectedId);
			});
			oldData['subject-specializedt-views']?.map((item) => {
				const selectedId =
					[...specialisedSubjects, ...optionalSubjects].find(
						(subject) => subject.label === item['subject-name']
					)?.value ?? 0;
				if (selectedId !== 0) specialisedSubjectIds.add(selectedId);
			});
			formik.setValues({
				'group-name': oldData['group-name'],
				'group-code': oldData['group-code'],
				'group-description': oldData['group-description'],
				grade: oldData.grade,
				'school-year-id': oldData['school-year-id'],
				'elective-subject-ids': Array.from(electiveSubjectIds),
				'specialized-subject-ids': Array.from(specialisedSubjectIds),
			});
		}
	}, [oldData]);

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
					className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3 py-2'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-medium-strong font-normal opacity-60'
					>
						Thêm tổ hợp môn
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
							<FormControl sx={{ width: '70%' }}>
								<InputLabel id='elective-label' variant='standard'>
									Thêm môn tự chọn
								</InputLabel>
								<Select
									labelId='elective-label'
									id='elective'
									multiple
									variant='standard'
									value={formik.values['elective-subject-ids']}
									onChange={(event) =>
										formik.setFieldValue(
											'elective-subject-ids',
											event.target.value
										)
									}
									onBlur={formik.handleBlur('elective-subject-ids')}
									error={
										formik.touched['elective-subject-ids'] &&
										Boolean(formik.errors['elective-subject-ids'])
									}
									MenuProps={MenuProps}
									sx={{ width: '100%' }}
								>
									{optionalSubjects.map((item, index) => (
										<MenuItem
											key={item.label + index}
											value={item.value}
											style={getStyles(
												item,
												optionalSubjects,
												theme
											)}
										>
											{item.label}
										</MenuItem>
									))}
								</Select>
								{formik.touched['elective-subject-ids'] &&
									formik.errors['elective-subject-ids'] && (
										<FormHelperText error variant='standard'>
											{formik.errors['elective-subject-ids']}
										</FormHelperText>
									)}
							</FormControl>
						</div>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start '>Môn chuyên đề</h3>
							<FormControl sx={{ width: '70%' }}>
								<InputLabel id='specialised-label' variant='standard'>
									Thêm môn chuyên đề
								</InputLabel>
								<Select
									labelId='specialised-label'
									id='specialised'
									multiple
									variant='standard'
									value={formik.values['specialized-subject-ids']}
									onChange={(event) =>
										formik.setFieldValue(
											'specialized-subject-ids',
											event.target.value
										)
									}
									onBlur={formik.handleBlur('specialized-subject-ids')}
									error={
										formik.touched['specialized-subject-ids'] &&
										Boolean(formik.errors['specialized-subject-ids'])
									}
									MenuProps={MenuProps}
									sx={{ width: '100%' }}
								>
									{specialisedSubjects.map((item, index) => (
										<MenuItem
											key={item.label + index}
											value={item.value}
											style={getStyles(
												item,
												optionalSubjects,
												theme
											)}
										>
											{item.label}
										</MenuItem>
									))}
								</Select>
								{formik.touched['specialized-subject-ids'] &&
									formik.errors['specialized-subject-ids'] && (
										<FormHelperText error variant='standard'>
											{formik.errors['specialized-subject-ids']}
										</FormHelperText>
									)}
							</FormControl>
						</div>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start '>Khối áp dụng</h3>
							<FormControl sx={{ width: '70%' }}>
								<InputLabel id='grade-label' variant='standard'>
									Thêm khối áp dụng
								</InputLabel>
								<Select
									labelId='grade-label'
									id='grade'
									variant='standard'
									value={formik.values.grade}
									onChange={(event) =>
										formik.setFieldValue('grade', event.target.value)
									}
									onBlur={formik.handleBlur('grade')}
									error={
										formik.touched.grade &&
										Boolean(formik.errors.grade)
									}
									MenuProps={MenuProps}
									sx={{ width: '100%' }}
								>
									{CLASSGROUP_STRING_TYPE.map((item, index) => (
										<MenuItem
											key={item.key + index}
											value={item.value}
										>
											{item.key}
										</MenuItem>
									))}
								</Select>
								{formik.touched.grade && formik.errors.grade && (
									<FormHelperText error variant='standard'>
										{formik.errors.grade}
									</FormHelperText>
								)}
							</FormControl>
						</div>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start '>
								Năm học áp dụng
							</h3>
							<FormControl sx={{ width: '70%' }}>
								<InputLabel id='school-year-label' variant='standard'>
									Thêm năm học áp dụng
								</InputLabel>
								<Select
									labelId='school-year-label'
									id='school-year'
									variant='standard'
									value={
										formik.values['school-year-id'] === 0
											? ''
											: formik.values['school-year-id']
									}
									onChange={(event) =>
										formik.setFieldValue(
											'school-year-id',
											event.target.value
										)
									}
									onBlur={formik.handleBlur('school-year-id')}
									error={
										formik.touched['school-year-id'] &&
										Boolean(formik.errors['school-year-id'])
									}
									MenuProps={MenuProps}
									sx={{ width: '100%' }}
								>
									{schoolYearOptions.map((item, index) => (
										<MenuItem
											key={item.label + index}
											value={item.value}
											style={getStyles(
												item,
												optionalSubjects,
												theme
											)}
										>
											{item.label}
										</MenuItem>
									))}
								</Select>
								{formik.touched['school-year-id'] &&
									formik.errors['school-year-id'] && (
										<FormHelperText error variant='standard'>
											{formik.errors['school-year-id']}
										</FormHelperText>
									)}
							</FormControl>
						</div>
					</div>
					<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
						<ContainedButton
							title='Cập nhật Tổ hợp'
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

export default UpdateSubjectGroupModal;
