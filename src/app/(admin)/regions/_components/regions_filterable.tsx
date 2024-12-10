import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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
import {
	getCreateDistrictApi,
	getCreateProvinceApi,
	getDeleteDistrictApi,
	getUpdateDistrictApi,
	getUpdateProvinceApi,
} from '../_libs/apis';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { KeyedMutator } from 'swr';

interface IEditingDistrict {
	code: number | string;
	name: string;
	isUpdated: boolean;
}

interface IAccountsFilterableProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	provinceData: IProvinceResponse[];
	districtData: IDistrictResponse[];
	selectedProvinceId: number;
	setSelectedProvinceId: React.Dispatch<React.SetStateAction<number>>;
	isUpdateAction: boolean;
	setIsUpdateAction: React.Dispatch<React.SetStateAction<boolean>>;
	updateProvince: KeyedMutator<any>;
	updateDistrict: KeyedMutator<any>;
}

const RegionsFilterable = (props: IAccountsFilterableProps) => {
	const {
		open,
		provinceData,
		districtData,
		setSelectedProvinceId,
		selectedProvinceId,
		isUpdateAction,
		setIsUpdateAction,
		updateDistrict,
		updateProvince,
	} = props;
	const { sessionToken } = useAppContext();

	const [isCancelConfirmModalOpen, setIsCancelConfirmModalOpen] = useState<boolean>(false);
	const [isSaveChangesConfirmModalOpen, setIsSaveChangesConfirmModalOpen] =
		useState<boolean>(false);

	const [districtNames, setDistrictNames] = useState<IEditingDistrict[]>([]);
	const [provinceName, setProvinceName] = useState<string>(''); // Province name input
	const [errorIndex, setErrorIndex] = useState<number | string | null>(null); // For district names
	const [provinceError, setProvinceError] = useState<boolean>(false); // For province name
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [existingProvince, setExistingProvince] = useState<IProvinceResponse | null>(null); // Store conflicting province
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		if (districtData.length > 0 && selectedProvinceId === existingProvince?.id && isUpdateAction) {
			setDistrictNames(
				districtData.map(
					(district) =>
						({
							code: district['district-code'] as number,
							name: district.name,
							isUpdated: false, // Đặt mặc định là chưa được cập nhật
						} as IEditingDistrict)
				)
			);
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
	const handleInputChange = (index: number | string, value: string) => {
		setErrorIndex(null); // Reset error state
		const newDistrictNames = districtNames.map((item) => {
			if (item.code === index) {
				return { ...item, name: value, isUpdated: true };
			} else return item;
		});
		setDistrictNames(newDistrictNames);

		// Check for duplicate district names
		const duplicateIndex = districtNames.findIndex(
			(district, i) => district.name.toLowerCase() === value.toLowerCase() && i !== index
		);
		if (duplicateIndex !== -1) {
			setErrorIndex(index);
		}
	};

	// Add a new district row
	const handleAddRow = () => {
		setDistrictNames((prev) => [
			...prev,
			{
				code: 'new' + prev.length + 1,
				name: '',
				isUpdated: true,
			} as IEditingDistrict,
		]);
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
	};

	const handleDialogReject = () => {
		console.log('User chose to rename the province');
		setDialogOpen(false);
		setProvinceName(''); // Clear province name
		setProvinceError(false);
	};

	const handleClearData = () => {
		setSelectedProvinceId(0);
		setExistingProvince(null);
		setProvinceName('');
		setDistrictNames([]);
		setProvinceError(false);
		setErrorIndex(null);
		setIsUpdateAction(false);
		setIsCancelConfirmModalOpen(false);
	};

	const fetchWithNotify = async (
		endpoint: string,
		method: 'POST' | 'PUT' | 'DELETE',
		data: any = null,
		successMessage: string,
		errorMessage: string
	): Promise<boolean> => {
		try {
			const response = await fetch(endpoint, {
				method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${sessionToken}`,
				},
				body: data ? JSON.stringify(data) : null,
			});

			if (response.ok) {
				useNotify({ message: successMessage, type: 'success' });
				return true;
			} else {
				const errorData = await response.json();
				useNotify({ message: errorData.message ?? errorMessage, type: 'error' });
				return false;
			}
		} catch (error) {
			useNotify({ message: errorMessage, type: 'error' });
			return false;
		}
	};

	const handleUpdateProvince = async () => {
		const updatedObject: IEditingDistrict[] = [];
		const newObject: IEditingDistrict[] = [];
		const removedObject: IDistrictResponse[] = districtData.filter(
			(item) => !districtNames.some((d) => d.code === item['district-code'])
		);

		districtNames.forEach((district) => {
			if (district.isUpdated && typeof district.code !== 'string') {
				updatedObject.push(district);
			} else if (typeof district.code === 'string') {
				newObject.push(district);
			}
		});

		const successFullArr: string[] = [];
		const failedArr: string[] = [];

		// Update districts
		for (const updated of updatedObject) {
			const endpoint = getUpdateDistrictApi({
				provinceId: selectedProvinceId,
				districtCode: Number(updated.code),
			});

			const success = await fetchWithNotify(
				endpoint,
				'PUT',
				{ name: updated.name },
				`Cập nhật quận/huyện ${updated.name} thành công`,
				`Cập nhật quận/huyện ${updated.name} thất bại`
			);

			if (success) successFullArr.push(updated.name);
			else failedArr.push(updated.name);
		}

		// Remove districts
		for (const removed of removedObject) {
			const endpoint = getDeleteDistrictApi({
				provinceId: selectedProvinceId,
				districtCode: Number(removed['district-code']),
			});

			const success = await fetchWithNotify(
				endpoint,
				'DELETE',
				null,
				`Xóa quận/huyện ${removed.name} thành công`,
				`Xóa quận/huyện ${removed.name} thất bại`
			);

			if (success) successFullArr.push(removed.name);
			else failedArr.push(removed.name);
		}

		// Add new districts
		if (newObject.length > 0) {
			const endpoint = getCreateDistrictApi(selectedProvinceId);
			const data = newObject.map((district) => ({ name: district.name }));

			const success = await fetchWithNotify(
				endpoint,
				'POST',
				data,
				`Thêm mới quận/huyện thành công`,
				`Thêm mới quận/huyện thất bại`
			);

			if (success) {
				successFullArr.push(...newObject.map((district) => district.name));
			} else {
				failedArr.push(...newObject.map((district) => district.name));
			}
		}

		// Update province name if changed
		if (provinceName !== existingProvince?.name) {
			const endpoint = getUpdateProvinceApi(selectedProvinceId);
			const success = await fetchWithNotify(
				endpoint,
				'PUT',
				{ name: provinceName },
				'Cập nhật tỉnh thành công',
				'Cập nhật tỉnh thất bại'
			);

			if (!success) failedArr.push(provinceName);
		}

		// Notify final result
		if (failedArr.length > 0) {
			useNotify({
				message: `Cập nhật quận/huyện ${failedArr.join(', ')} thất bại`,
				type: 'error',
			});
		} else {
			useNotify({
				message: `Cập nhật quận/huyện ${successFullArr.join(', ')} thành công`,
				type: 'success',
			});
		}

		updateDistrict();
		updateProvince();
		handleClearData();
		setIsSaveChangesConfirmModalOpen(false);
	};

	const handleCreateProvince = async () => {
		const endpoint = getCreateProvinceApi();
		const formData: { name: string }[] = [{ name: provinceName }];

		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionToken}`,
			},
			body: JSON.stringify(formData),
		});
		const data = await response.json();
		if (response.ok) {
			useNotify({
				message: data.message ?? 'Thêm mới tỉnh thành công',
				type: 'success',
			});
		} else {
			useNotify({
				message: data.message ?? 'Thêm mới tỉnh thất bại',
				type: 'error',
			});
		}

		updateProvince();
		handleClearData();
		setIsSaveChangesConfirmModalOpen(false);
	};

	const handleSaveChanges = () => {
		if (isUpdateAction) {
			handleUpdateProvince();
		} else {
			handleCreateProvince();
		}
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
						disabled={existingProvince === null}
						className='!translate-y-2'
						sx={{ position: 'sticky', top: 0, left: 0 }}
					>
						<AddCircleOutlineIcon />
					</IconButton>
					<div className='w-[70%] flex flex-col-reverse justify-end items-center'>
						<TransitionGroup component={null}>
							{districtNames.map((district: IEditingDistrict, index) => (
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
											value={district.name}
											error={errorIndex === index}
											helperText={errorIndex === index ? 'Tên huyện này đã bị trùng!' : ''}
											onChange={(e) => handleInputChange(district.code, e.target.value)}
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
					handleApprove={handleClearData}
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
