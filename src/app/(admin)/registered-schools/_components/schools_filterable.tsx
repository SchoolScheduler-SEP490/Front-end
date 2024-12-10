import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import CloseIcon from '@mui/icons-material/Close';
import {
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Typography,
} from '@mui/material';
import { ACCOUNT_STATUS, DROPDOWN_ACCOUNT_STATUS, SCHOOL_STATUS } from '../../_utils/constants';

interface IAccountsFilterableProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	selectedAccountStatus: string;
	setSelectedAccountStatus: React.Dispatch<React.SetStateAction<string>>;
	selectedProvinceId: number;
	setSelectedProvinceId: React.Dispatch<React.SetStateAction<number>>;
	selectedDistrictId: number;
	setSelectedDistrictId: React.Dispatch<React.SetStateAction<number>>;
	provinceOptions: IDropdownOption<number>[];
	districtOptions: IDropdownOption<number>[];
}

const SchoolsFilterable = (props: IAccountsFilterableProps) => {
	const {
		open,
		setOpen,
		selectedAccountStatus,
		setSelectedAccountStatus,
		selectedDistrictId,
		selectedProvinceId,
		setSelectedDistrictId,
		setSelectedProvinceId,
		districtOptions,
		provinceOptions,
	} = props;

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div
			className={`opacity-0 h-full w-[23%] flex flex-col justify-start items-center pt-1 gap-3 transition-all duration-300 ease-in-out transform ${
				open ? 'translate-x-0 opacity-100' : '!w-0 translate-x-full opacity-0'
			}`}
		>
			<Paper className='w-full p-3 flex flex-col justify-start items-center gap-3'>
				<div className='w-full flex flex-row justify-between items-center pt-1'>
					<Typography variant='h6' className='text-title-small-strong font-normal w-full text-left'>
						Bộ lọc
					</Typography>
					<IconButton onClick={handleClose} className='translate-x-2'>
						<CloseIcon />
					</IconButton>
				</div>
				<FormControl fullWidth variant='filled' sx={{ m: 1, minWidth: 120 }}>
					<InputLabel
						id='demo-simple-select-filled-label'
						className='!text-body-xlarge font-normal'
					>
						Trạng thái trường học
					</InputLabel>
					<Select
						labelId='demo-simple-select-filled-label'
						id='demo-simple-select-filled'
						value={selectedAccountStatus}
						onChange={(event) => setSelectedAccountStatus(event.target.value as string)}
					>
						<MenuItem value={'All'}>{DROPDOWN_ACCOUNT_STATUS['All']}</MenuItem>
						{Object.entries(SCHOOL_STATUS).map(([key, value], index) => (
							<MenuItem key={index} value={key}>
								{value}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl fullWidth variant='filled' sx={{ m: 1, minWidth: 120, maxHeight: 500 }}>
					<InputLabel
						id='demo-simple-select-filled-label'
						className='!text-body-xlarge font-normal'
					>
						Chọn tỉnh
					</InputLabel>
					<Select
						labelId='demo-simple-select-filled-label'
						id='demo-simple-select-filled'
						value={selectedProvinceId}
						onChange={(event) => setSelectedProvinceId(Number(event.target.value))}
						MenuProps={{
							PaperProps: {
								style: {
									maxHeight: 200, // Giới hạn chiều cao danh sách
									overflow: 'auto', // Thêm cuộn nếu danh sách vượt quá chiều cao
									msOverflowStyle: 'none',
									/* IE and Edge */
									scrollbarWidth: 'none',
								},
							},
						}}
					>
						<MenuItem value={0}>Tất cả</MenuItem>
						{provinceOptions.map((option, index) => (
							<MenuItem key={index} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl fullWidth variant='filled' sx={{ m: 1, minWidth: 120, maxHeight: 500 }}>
					<InputLabel
						id='demo-simple-select-filled-label'
						className='!text-body-xlarge font-normal'
					>
						Chọn quận/huyện
					</InputLabel>
					<Select
						labelId='demo-simple-select-filled-label'
						id='demo-simple-select-filled'
						value={selectedDistrictId}
						onChange={(event) => setSelectedDistrictId(Number(event.target.value))}
						MenuProps={{
							PaperProps: {
								style: {
									maxHeight: 200, // Giới hạn chiều cao danh sách
									overflow: 'auto', // Thêm cuộn nếu danh sách vượt quá chiều cao
									msOverflowStyle: 'none',
									/* IE and Edge */
									scrollbarWidth: 'none',
								},
							},
						}}
					>
						<MenuItem value={0}>Tất cả</MenuItem>
						{districtOptions.map((option, index) => (
							<MenuItem key={index} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Paper>
		</div>
	);
};

export default SchoolsFilterable;
