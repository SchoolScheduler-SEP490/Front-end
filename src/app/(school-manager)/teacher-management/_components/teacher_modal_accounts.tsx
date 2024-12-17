'use client';
import { ACCOUNT_STATUS } from '@/app/(admin)/_utils/constants';
import { useAppContext } from '@/context/app_provider';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
	Box,
	Chip,
	IconButton,
	Menu,
	MenuItem,
	Modal,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useFetchTeacherAccounts from '../_hooks/useFetchTeacherAccounts';
import {
	IGenerateAccountRequest,
	ITeacherAccountResponse,
	IUpdateAccountRequest,
} from '../_libs/constants';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { getGenerateTeacherAccountsApi, getUpdateStatusSchoolApi } from '../_libs/apiTeacher';
import PersonIcon from '@mui/icons-material/Person';
import useNotify from '@/hooks/useNotify';
import TeacherActiveModal from './teacher_modal_active';
import TeacherConfirmModal from './teacher_modal_confirm';
import { TRANSLATOR } from '@/utils/dictionary';
import TeacherInactiveModal from './teacher_modal_inactive';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '60vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface IPublishTimetableConfirmModalProps {
	open: boolean;
	setOpen: (status: boolean) => void;
}

const TeacherAccountModal = (props: IPublishTimetableConfirmModalProps) => {
	const { open, setOpen } = props;
	const { schoolId, sessionToken } = useAppContext();

	const { data: teacherAccountData, mutate: updateTeacherAccountData } = useFetchTeacherAccounts({
		schoolId: Number(schoolId),
		sessionToken,
	});

	useEffect(() => {
		updateTeacherAccountData();
		if (teacherAccountData) {
			setTeacherAccountTableData(teacherAccountData.result.items);
		}
	}, [teacherAccountData, open]);

	const [teacherAccountTableData, setTeacherAccountTableData] = useState<ITeacherAccountResponse[]>(
		[]
	);
	const [selectedTeacher, setSelectedTeacher] = useState<ITeacherAccountResponse | null>(null);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
	const [isConfirmInactiveModalOpen, setIsConfirmInactiveModalOpen] = useState<boolean>(false);
	const [isConfirmActiveModalOpen, setIsConfirmActiveModalOpen] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [menuIndex, setMenuIndex] = useState(null);

	const handleClick = (event: any, index: any, teacher: ITeacherAccountResponse) => {
		setAnchorEl(event.currentTarget);
		setMenuIndex(index);
		setSelectedTeacher(teacher);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
		setMenuIndex(null);
	};

	const handleAction = (action: any) => {
		switch (action) {
			case 'active':
				setIsConfirmActiveModalOpen(true);
				break;
			case 'inactive':
				setIsConfirmInactiveModalOpen(true);
				break;
			case 'generate':
				setIsConfirmModalOpen(true);
				break;
			default:
				break;
		}
	};

	const handleAddTeacherAccount = async () => {
		const endpoint = getGenerateTeacherAccountsApi(Number(schoolId));
		const formData: IGenerateAccountRequest = {
			'school-id': Number(schoolId),
			'teacher-id': selectedTeacher?.id ?? 0,
		};
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionToken}`,
			},
			body: JSON.stringify(formData),
		});

		if (response.ok) {
			const data = await response.json();
			useNotify({
				message: TRANSLATOR[data.message] ?? 'Tạo tài khoản thành công',
				type: 'success',
			});
			updateTeacherAccountData();
		} else {
			const data = await response.json();
			useNotify({
				message: data.message ?? 'Tạo tài khoản thất bại',
				type: 'error',
			});
		}
		setIsConfirmModalOpen(false);
		handleCloseMenu();
	};

	const handleUpdateAccount = async (newStatus: 'Active' | 'Pending' | 'Inactive') => {
		const formProcessApi = getUpdateStatusSchoolApi();
		const formData: IUpdateAccountRequest = {
			'account-id': selectedTeacher?.['account-id'] ?? 0,
			'account-status': newStatus,
		};

		const response = await fetch(formProcessApi, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${sessionToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});

		if (response.ok) {
			const data = await response.json();
			updateTeacherAccountData();
			useNotify({
				message: TRANSLATOR[data.message] ?? data.message ?? 'Thao tác thành công',
				type: 'success',
			});
		} else {
			const data = await response.json();
			updateTeacherAccountData();
			useNotify({
				message: TRANSLATOR[data.message] ?? data.message ?? 'Thao tác thất bại',
				type: 'error',
			});
		}
		setIsConfirmActiveModalOpen(false);
		setIsConfirmInactiveModalOpen(false);
		handleCloseMenu();
	};

	const handleCloseModal = () => {
		setOpen(false);
		setTeacherAccountTableData([]);
	};

	const getRoleColor = (role: string) => {
		switch (role) {
			case 'TEACHER':
				return 'default';
			case 'TEACHER_DEPARTMENT_HEAD':
				return 'primary';
			default:
				return 'default';
		}
	};

	const getRoleName = (role: string) => {
		switch (role) {
			case 'TEACHER':
				return 'Giáo viên';
			case 'TEACHER_DEPARTMENT_HEAD':
				return 'Tổ trưởng';
			default:
				return 'default';
		}
	};

	// Hàm chọn màu cho trạng thái tài khoản
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Hoạt động':
				return 'success';
			case 'Chưa tạo':
				return 'warning';
			case 'Vô hiệu':
				return 'error';
			default:
				return 'default';
		}
	};

	return (
		<Modal
			disableEnforceFocus
			disableAutoFocus
			disableRestoreFocus
			open={open}
			onClose={handleCloseModal}
			aria-labelledby='keep-mounted-modal-title'
			aria-describedby='keep-mounted-modal-description'
		>
			<Box sx={style}>
				<div
					id='modal-header'
					className='w-full h-fit flex flex-row justify-between items-center p-2 pl-5'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-large-strong font-semibold !opacity-80'
					>
						Tài khoản giáo viên
					</Typography>
					<IconButton onClick={handleCloseModal}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-fit max-h-[70vh] overflow-y-scroll no-scrollbar px-2'>
					<TableContainer sx={{ margin: 'auto' }}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell align='center' sx={{ fontWeight: 'bold' }}>
										STT
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold' }}>Tên giáo viên</TableCell>
									<TableCell align='center' sx={{ fontWeight: 'bold' }}>
										Mã GV
									</TableCell>
									<TableCell align='center' sx={{ fontWeight: 'bold' }}>
										Vị trí
									</TableCell>
									<TableCell align='center' sx={{ fontWeight: 'bold' }}>
										Email
									</TableCell>
									<TableCell align='center' sx={{ fontWeight: 'bold' }}>
										Trạng thái
									</TableCell>
									<TableCell align='center' sx={{ fontWeight: 'bold' }}></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{teacherAccountTableData.map((teacher: ITeacherAccountResponse, index: number) => (
									<TableRow key={index}>
										<TableCell align='center' width={50}>
											{index + 1}
										</TableCell>
										<TableCell>{`${teacher['first-name']} ${teacher['last-name']}`}</TableCell>
										<TableCell align='center' width={50}>
											{teacher.abbreviation}
										</TableCell>
										<TableCell align='center'>
											<Chip
												label={getRoleName(teacher['teacher-role'])}
												color={getRoleColor(teacher['teacher-role'])}
											/>
										</TableCell>
										<TableCell align='center'>{teacher.email}</TableCell>
										<TableCell align='center'>
											<Chip
												label={
													!teacher['is-have-account']
														? 'Chưa tạo'
														: ACCOUNT_STATUS[teacher['account-status'] ?? '']
												}
												color={getStatusColor(
													!teacher['is-have-account']
														? 'Chưa tạo'
														: ACCOUNT_STATUS[teacher['account-status'] ?? '']
												)}
											/>
										</TableCell>
										<TableCell align='center'>
											<IconButton onClick={(e) => handleClick(e, index, teacher)}>
												<MoreVertIcon />
											</IconButton>
											{menuIndex === index && (
												<Menu
													anchorEl={anchorEl}
													open={Boolean(anchorEl)}
													onClose={handleCloseMenu}
												>
													<MenuItem
														onClick={() => handleAction('active')}
														disabled={
															!teacher['is-have-account'] || teacher['account-status'] === 'Active'
														}
													>
														<PersonIcon color='success' sx={{ marginRight: 2 }} />
														Khôi phục tài khoản
													</MenuItem>
													<MenuItem
														onClick={() => handleAction('inactive')}
														disabled={
															!teacher['is-have-account'] ||
															teacher['account-status'] === 'Inactive'
														}
													>
														<NoAccountsIcon color='error' sx={{ marginRight: 2 }} />
														Vô hiệu tài khoản
													</MenuItem>
													<MenuItem
														onClick={() => handleAction('generate')}
														disabled={teacher['is-have-account']}
													>
														<PersonAddIcon color='primary' sx={{ marginRight: 2 }} />
														Tạo tài khoản
													</MenuItem>
												</Menu>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
				<TeacherActiveModal
					open={isConfirmActiveModalOpen}
					setOpen={setIsConfirmActiveModalOpen}
					handleConfirm={() => handleUpdateAccount('Active')}
					selectedTeacherName={`${selectedTeacher?.['first-name']} ${selectedTeacher?.['last-name']} (${selectedTeacher?.abbreviation})`}
				/>

				<TeacherInactiveModal
					open={isConfirmInactiveModalOpen}
					setOpen={setIsConfirmInactiveModalOpen}
					handleConfirm={() => handleUpdateAccount('Inactive')}
					selectedTeacherName={`${selectedTeacher?.['first-name']} ${selectedTeacher?.['last-name']} (${selectedTeacher?.abbreviation})`}
				/>

				<TeacherConfirmModal
					open={isConfirmModalOpen}
					setOpen={setIsConfirmModalOpen}
					handleConfirm={handleAddTeacherAccount}
				/>
			</Box>
		</Modal>
	);
};

export default TeacherAccountModal;
