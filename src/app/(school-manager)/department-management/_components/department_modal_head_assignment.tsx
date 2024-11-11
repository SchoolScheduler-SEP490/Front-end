import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import CloseIcon from '@mui/icons-material/Close';
import {
	Box,
	FormControl,
	IconButton,
	InputLabel,
	ListItemText,
	MenuItem,
	Modal,
	Select,
	SelectChangeEvent,
	Theme,
	Typography,
	useTheme,
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IDropdownOption } from '../../_utils/contants';
import useFetchTeacher from '../_hooks/useFetchTeacher';
import {
	IDepartmentHeadAssignmentRequest,
	IDepartmentTableData,
	ITeacherResponse,
} from '../_libs/constants';
import CreateConfirmationModal from './department_modal_confirm';
import useFilterArray from '@/hooks/useFilterArray';
import useUpdateDepartment from '../_hooks/useUpdateDepartment';
import useAssignDepartmentHead from '../_hooks/useAssignDepartmentHead';
import { KeyedMutator } from 'swr';

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
			width: 200,
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

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '50vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface IDepartmentHeadAssignmentProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	departmentData: IDepartmentTableData[];
	updateDepartment: KeyedMutator<any>;
}

const DepartmentHeadAssignmentModal = (props: IDepartmentHeadAssignmentProps) => {
	const { open, setOpen, departmentData, updateDepartment } = props;
	const theme = useTheme();
	const { schoolId, sessionToken } = useAppContext();

	const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
	const [editingObjects, setEditingObjects] = useState<IDepartmentHeadAssignmentRequest[]>([]);
	const [teacherOptions, setTeacherOptions] = useState<IDropdownOption<number>[]>([]);
	const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(0);
	const [selectedTeachers, setSelectedTeachers] = useState<IDropdownOption<number>[]>([]);

	const { data: teacherData, mutate: updateTeacherData } = useFetchTeacher({
		schoolId,
		sessionToken,
		pageIndex: 1,
		pageSize: 1000,
		...(selectedDepartmentId !== 0 && { departmentId: selectedDepartmentId }),
	});

	useEffect(() => {
		if (open) {
			if (departmentData.length > 0) {
				var tmpEditingObjects: IDepartmentHeadAssignmentRequest[] = [];
				var tmpSelectedTeachers: IDropdownOption<number>[] = [];
				departmentData.map((department) => {
					if (department.departmentHeadId) {
						tmpEditingObjects.push({
							'department-id': department.id,
							'teacher-id': department.departmentHeadId,
						} as IDepartmentHeadAssignmentRequest);
						tmpSelectedTeachers.push({
							label: department.departmentHeadName,
							value: department.departmentHeadId,
						} as IDropdownOption<number>);
					}
				});
				setEditingObjects(tmpEditingObjects);
				setSelectedTeachers(tmpSelectedTeachers);
			}
		}
	}, [departmentData, open]);

	useEffect(() => {
		if (open) {
			if (teacherData?.status === 200) {
				const tmpTeacherOptions: IDropdownOption<number>[] = teacherData.result.items.map(
					(teacher: ITeacherResponse) =>
						({
							label: `${teacher['first-name']} ${teacher['last-name']} (${teacher['abbreviation']})`,
							value: teacher.id,
						} as IDropdownOption<number>)
				);
				setTeacherOptions(tmpTeacherOptions);
			}
		}
	}, [teacherData, open, selectedDepartmentId]);

	const handleChangeDropdownOptions = (departmentId: number) => {
		setTeacherOptions([]);
		setSelectedDepartmentId(departmentId);
	};

	const handleSelectTeacher = (departmentId: number, teacherId: number) => {
		if (teacherId) {
			const editingObject: IDepartmentHeadAssignmentRequest =
				editingObjects.find((object) => object['department-id'] === departmentId) ??
				({
					'department-id': departmentId,
					'teacher-id': teacherId,
				} as IDepartmentHeadAssignmentRequest);
			editingObject['teacher-id'] = teacherId;
			const newEditingObjects = useFilterArray(
				[...editingObjects, editingObject],
				'department-id'
			);
			setEditingObjects(newEditingObjects);

			const selectedTeacher = teacherOptions.find((opt) => opt.value === teacherId);
			if (selectedTeacher) {
				setSelectedTeachers((prev) => useFilterArray([...prev, selectedTeacher], 'value'));
			}
		}
	};

	const handleFormSubmit = async () => {
		await useAssignDepartmentHead({
			schoolId: Number(schoolId),
			sessionToken,
			formData: editingObjects,
		});
		updateDepartment();
		handleClose();
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Modal
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
						Thêm tổ bộ môn
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-[50vh] p-3 flex flex-col justify-start items-start gap-3 overflow-y-scroll no-scrollbar'>
					{departmentData.map((department: IDepartmentTableData, index) => (
						<div
							className='w-full flex flex-row justify-between items-baseline'
							key={index}
						>
							<h1>{department.departmentName}</h1>
							<FormControl sx={{ width: '70%' }}>
								<InputLabel id='elective-label' variant='standard'>
									Chọn tổ trưởng
								</InputLabel>
								<Select
									labelId='elective-label'
									id='department-head'
									variant='standard'
									value={
										editingObjects.find(
											(obj) => obj['department-id'] === department.id
										)?.['teacher-id']
									}
									onOpen={() => handleChangeDropdownOptions(department.id)}
									onChange={(event: SelectChangeEvent<number>) => {
										handleSelectTeacher(
											department.id,
											Number(event.target.value)
										);
									}}
									MenuProps={MenuProps}
									sx={{ width: '100%', height: 32 }}
									renderValue={(selected) =>
										selectedTeachers.find(
											(teacher) => teacher.value === selected
										)?.label
									}
								>
									{teacherOptions.length === 0 && (
										<MenuItem disabled value={0}>
											Không tìm thấy giáo viên phù hợp
										</MenuItem>
									)}
									{teacherOptions.map(
										(teacher: IDropdownOption<number>, index: number) => (
											<MenuItem
												key={teacher.label + index}
												value={teacher.value}
												style={getStyles(teacher, teacherOptions, theme)}
											>
												<ListItemText primary={teacher.label} />
											</MenuItem>
										)
									)}
								</Select>
							</FormControl>
						</div>
					))}
				</div>
				<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
					<ContainedButton
						title='phân công'
						disableRipple
						disabled={editingObjects.length === 0}
						onClick={() => setIsConfirmOpen(true)}
						styles='bg-primary-300 text-white !py-1 px-4'
					/>
					<ContainedButton
						title='Huỷ'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
					/>
				</div>
				<CreateConfirmationModal
					handleConfirm={handleFormSubmit}
					setOpen={setIsConfirmOpen}
					open={isConfirmOpen}
				/>
			</Box>
		</Modal>
	);
};

export default DepartmentHeadAssignmentModal;
