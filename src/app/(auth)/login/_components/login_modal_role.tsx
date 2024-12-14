import { Button, Dialog, DialogTitle, List, ListItem, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { USER_ROLE_TRANSLATOR } from '../../_utils/constants';

export const USER_ROLE_COLOR: {
	[key: string]: 'inherit' | 'success' | 'warning' | 'primary' | 'secondary' | 'error' | 'info';
} = {
	Teacher: 'inherit',
	TeacherDepartmentHead: 'success',
	Admin: 'info',
	SchoolManager: 'warning',
};

interface ILoginRoleSelectorProps {
	roleOptions: string[];
	selected: string;
	setSelected: Dispatch<SetStateAction<string>>;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

const LoginRoleSelector = (props: ILoginRoleSelectorProps) => {
	const { roleOptions, setSelected, open, setOpen } = props;

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Dialog
			onClose={handleClose}
			open={open}
			sx={{
				'& .MuiDialog-paper': {
					width: '80%',
					maxWidth: '400px',
					transform: 'translate(0, -15vh)',
				},
			}}
		>
			<DialogTitle>Tùy chọn đăng nhập</DialogTitle>
			<List sx={{ pt: 0 }}>
				{roleOptions.map((roleOption) => (
					<ListItem disablePadding key={roleOption}>
						<Button
							fullWidth
							disableRipple
							variant='contained'
							color={USER_ROLE_COLOR[roleOption]}
							sx={{ bgcolor: '#004e89', color: 'white', borderRadius: 0, boxShadow: 'none', m: 1 }}
							onClick={() => setSelected(roleOption)}
						>
							<Typography variant='body1' >
								{USER_ROLE_TRANSLATOR[roleOption]}
							</Typography>
						</Button>
					</ListItem>
				))}
			</List>
		</Dialog>
	);
};

export default LoginRoleSelector;
