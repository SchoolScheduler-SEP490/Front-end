import { Button, Paper, Skeleton } from '@mui/material';

const AccountsFilterableSkeleton = () => {
	return (
		<div className={`h-full w-[23%] flex flex-col justify-start items-center pt-[4vh] gap-5`}>
			<Button
				variant='contained'
				fullWidth
				color='inherit'
				sx={{ bgcolor: '#175b8e', color: 'white', borderRadius: 0 }}
			>
				Phân công tự động
			</Button>
			<Paper className='w-full p-3 flex flex-col justify-start items-center gap-3'>
				<Skeleton variant='text' sx={{ fontSize: '2rem', width: 210 }} />

				{/* For other variants, adjust the size with `width` and `height` */}
				<Skeleton variant='rectangular' width={210} height={60} />
				<Skeleton variant='rounded' width={210} height={60} />
			</Paper>
		</div>
	);
};

export default AccountsFilterableSkeleton;
