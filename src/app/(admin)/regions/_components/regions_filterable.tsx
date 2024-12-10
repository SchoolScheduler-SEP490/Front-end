import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { IDistrictResponse, IProvinceResponse } from '../_libs/constants';
import styles from '../_styles/table_styles.module.css';
import RegionsConfirmationModal from './regions_modal_apply_confirm';
import RegionsCancelConfirmModal from './regions_modal_cancel';

interface IAccountsFilterableProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	provinceData: IProvinceResponse[];
	districtData: IDistrictResponse[];
	selectedProvinceId: number;
	setSelectedProvinceId: React.Dispatch<React.SetStateAction<number>>;
	isUpdateAction: boolean;
	setIsUpdateAction: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegionsFilterable = (props: IAccountsFilterableProps) => {
	const {
		open,
		setOpen,
		provinceData,
		districtData,
		setSelectedProvinceId,
		selectedProvinceId,
		isUpdateAction,
		setIsUpdateAction,
	} = props;

	const [isCancelConfirmModalOpen, setIsCancelConfirmModalOpen] = useState<boolean>(false);
	const [isSaveChangesConfirmModalOpen, setIsSaveChangesConfirmModalOpen] =
		useState<boolean>(false);

	const [districtNames, setDistrictNames] = useState<string[]>(['']);
	const [provinceName, setProvinceName] = useState<string>(''); // Province name input
	const [errorIndex, setErrorIndex] = useState<number | null>(null); // For district names
	const [provinceError, setProvinceError] = useState<boolean>(false); // For province name
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [existingProvince, setExistingProvince] = useState<IProvinceResponse | null>(null); // Store conflicting province
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		if (districtData.length > 0 && selectedProvinceId === existingProvince?.id && isUpdateAction) {
			setDistrictNames(districtData.map((district) => district.name));
		}
	}, [districtData, selectedProvinceId, existingProvince]);

	// Set input refs
	const setRef = (index: number, ref: HTMLInputElement | null) => {
		inputRefs.current[index] = ref;
	};

	useEffect(() => {
		if (selectedProvinceId !== 0) {
			const existingProvince = provinceData.find((province) => province.id === selectedProvinceId);
			setProvinceName(existingProvince?.name || '');
			setExistingProvince(existingProvince ?? null);
		}
	}, [selectedProvinceId]);

	// Validate province name
	const handleProvinceChange = (value: string) => {
		setProvinceName(value);
		setProvinceError(false); // Reset error state

		const conflictingProvince = provinceData.find(
			(province) => province.name.toLowerCase() === value.toLowerCase()
		);

		if (conflictingProvince) {
			setProvinceError(true);
			setExistingProvince(conflictingProvince);
			setDialogOpen(true); // Show modal
		} else {
			setExistingProvince(null); // Clear conflict
		}
	};

	// Validate district name
	const handleInputChange = (index: number, value: string) => {
		setErrorIndex(null); // Reset error state
		const newDistrictNames = [...districtNames];
		newDistrictNames[index] = value;
		setDistrictNames(newDistrictNames);

		// Check for duplicate district names
		const duplicateIndex = districtNames.findIndex(
			(name, i) => name.toLowerCase() === value.toLowerCase() && i !== index
		);
		if (duplicateIndex !== -1) {
			setErrorIndex(index);
		}
	};

	// Add a new district row
	const handleAddRow = () => {
		setDistrictNames((prev) => [...prev, '']);
		setTimeout(() => {
			const lastIndex = inputRefs.current.length - 1;
			inputRefs.current[lastIndex]?.focus();
		}, 0);
	};

	// Remove a district row
	const handleRemoveRow = (indexToRemove: number) => {
		if (districtNames.length === 1) return;
		setDistrictNames((prev) => prev.filter((_, index) => index !== indexToRemove));
	};

	// Handle dialog actions
	const handleDialogAccept = () => {
		setDialogOpen(false);
		setSelectedProvinceId(existingProvince?.id || 0); // Set selected province
		setProvinceError(false);
		setIsUpdateAction(true);
		// Perform logic to update the existing province
	};

	const handleDialogReject = () => {
		console.log('User chose to rename the province');
		setDialogOpen(false);
		setProvinceName(''); // Clear province name
		setProvinceError(false);
	};

	const handleCancelAction = () => {
		setProvinceName('');
		setDistrictNames(['']);
		setProvinceError(false);
		setErrorIndex(null);
		setIsUpdateAction(false);
		setIsCancelConfirmModalOpen(false);
	};

	const handleUpdateProvince = () => {
		alert('Update province');
	};

	const handleCreateProvince = () => {
		alert('Create province');
	};

	const handleSaveChanges = () => {
		if (isUpdateAction) {
			handleUpdateProvince();
		} else {
			handleCreateProvince();
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div
			className={`opacity-0 h-full w-[35%] flex flex-col justify-start items-center pt-[3vh] gap-3 transition-all duration-300 ease-in-out transform ${
				open ? 'translate-x-0 opacity-100' : '!w-0 translate-x-full opacity-0'
			}`}
		>
			<Paper className='w-full p-3 flex flex-col justify-start items-center gap-3'>
				<div className='w-full flex flex-row justify-between items-center pt-1'>
					<Typography variant='h6' className='text-title-small-strong font-normal w-full text-left'>
						{isUpdateAction ? 'Cập nhật' : 'Thêm'} vùng miền
					</Typography>
					<IconButton onClick={handleClose} className='translate-x-2'>
						<CloseIcon />
					</IconButton>
				</div>
				<TextField
					fullWidth
					label='Tên tỉnh'
					variant='standard'
					value={provinceName}
					onChange={(e) => handleProvinceChange(e.target.value)}
					error={provinceError}
					helperText={provinceError ? 'Tên tỉnh này đã tồn tại trong hệ thống!' : ''}
				/>
				<div className='relative w-full max-h-[50vh] flex flex-row justify-between items-baseline overflow-y-scroll no-scrollbar'>
					<IconButton
						color='primary'
						onClick={handleAddRow}
						className='!translate-y-2'
						sx={{ position: 'sticky', top: 0, left: 0 }}
					>
						<AddCircleOutlineIcon />
					</IconButton>
					<div className='w-[70%] flex flex-col-reverse justify-end items-center'>
						<TransitionGroup component={null}>
							{districtNames.map((name, index) => (
								<CSSTransition
									key={index}
									timeout={200}
									classNames={{
										enter: styles.rowEnter,
										enterActive: styles.rowEnterActive,
										exit: styles.rowExit,
										exitActive: styles.rowExitActive,
									}}
								>
									<Box display='flex' alignItems='center' mb={1} key={index} width={'100%'}>
										<TextField
											fullWidth
											inputRef={(ref) => setRef(index, ref)}
											label={`Tên huyện ${index + 1}`}
											variant='standard'
											value={name}
											error={errorIndex === index}
											helperText={errorIndex === index ? 'Tên huyện này đã bị trùng!' : ''}
											onChange={(e) => handleInputChange(index, e.target.value)}
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													e.preventDefault();
													handleAddRow();
												}
											}}
										/>
										<IconButton
											color='error'
											className='!translate-y-2'
											onClick={() => handleRemoveRow(index)}
											sx={{ marginLeft: 1 }}
											disabled={districtNames.length === 1}
										>
											<RemoveCircleOutlineIcon />
										</IconButton>
									</Box>
								</CSSTransition>
							))}
						</TransitionGroup>
					</div>

					<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
						<DialogTitle>Xung đột tên tỉnh</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Tên tỉnh "{existingProvince?.name}" đã tồn tại trong hệ thống. Bạn muốn đổi tên hay
								cập nhật thông tin cho tỉnh hiện tại?
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleDialogReject} color='primary'>
								Đổi tên
							</Button>
							<Button onClick={handleDialogAccept} color='warning' autoFocus>
								Cập nhật
							</Button>
						</DialogActions>
					</Dialog>
				</div>
				<div className='w-full h-fit flex flex-row justify-between items-center'>
					<Button
						variant='contained'
						color='inherit'
						onClick={() => setIsCancelConfirmModalOpen(true)}
						sx={{ width: '30%', backgroundColor: '#E0E0E0', borderRadius: 0, boxShadow: 'none' }}
					>
						Hủy
					</Button>
					<Button
						variant='contained'
						color='inherit'
						onClick={() => setIsSaveChangesConfirmModalOpen(true)}
						sx={{
							width: '60%',
							backgroundColor: '#004e89',
							color: 'white',
							borderRadius: 0,
							boxShadow: 'none',
						}}
					>
						{isUpdateAction ? 'Cập nhật' : 'Thêm mới'}
					</Button>
				</div>
				<RegionsCancelConfirmModal
					open={isCancelConfirmModalOpen}
					setOpen={setIsCancelConfirmModalOpen}
					handleApprove={handleCancelAction}
				/>
				<RegionsConfirmationModal
					open={isSaveChangesConfirmModalOpen}
					setOpen={setIsSaveChangesConfirmModalOpen}
					handleConfirm={handleSaveChanges}
				/>
			</Paper>
		</div>
	);
};

export default RegionsFilterable;
