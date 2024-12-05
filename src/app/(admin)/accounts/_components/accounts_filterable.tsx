'use client';

import CloseIcon from '@mui/icons-material/Close';
import {
	Button,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Typography,
} from '@mui/material';
import { ACCOUNT_STATUS, DROPDOWN_ACCOUNT_STATUS } from '../../_utils/constants';

interface IAccountsFilterableProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	selectedAccountStatus: string;
	setSelectedAccountStatus: React.Dispatch<React.SetStateAction<string>>;
}

const AccountsFilterable = (props: IAccountsFilterableProps) => {
	const { open, setOpen, selectedAccountStatus, setSelectedAccountStatus } = props;

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
						Trạng thái tài khoản
					</InputLabel>
					<Select
						labelId='demo-simple-select-filled-label'
						id='demo-simple-select-filled'
						value={selectedAccountStatus}
						onChange={(event) => setSelectedAccountStatus(event.target.value as string)}
					>
						<MenuItem value={'All'}>{DROPDOWN_ACCOUNT_STATUS['All']}</MenuItem>
						{Object.entries(ACCOUNT_STATUS).map(([key, value], index) => (
							<MenuItem key={index} value={key}>
								{value}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Paper>
		</div>
	);
};

export default AccountsFilterable;
