import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import { useSMSelector } from '@/hooks/useReduxStore';
import {
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Typography,
} from '@mui/material';
import { FC } from 'react';

interface IDetailsGeneralConfigurationProps {
	// Add data here
}

const DetailsGeneralConfiguration: FC<IDetailsGeneralConfigurationProps> = (props) => {
	const {} = props;
	const { dataStored }: ITimetableGenerationState = useSMSelector(
		(state) => state.timetableGeneration
	);

	return (
		<div className='w-full h-[60vh] flex justify-center items-center'>
			<Card sx={{ maxWidth: '50%' }}>
				<CardActionArea>
					<CardContent>
						<Typography gutterBottom variant='h6' component='div'>
							Cấu hình chung
						</Typography>
						<div className='w-full flex flex-row justify-start items-baseline gap-2 py-1'>
							<Typography sx={{ color: 'text.secondary' }}>Số ngày học trong tuần:</Typography>{' '}
							<Typography>{dataStored?.['days-in-week'] ?? 0}</Typography>
						</div>
						<div className='w-full flex flex-row justify-start items-baseline gap-2 py-1'>
							<Typography sx={{ color: 'text.secondary' }}>Khoảng nghỉ giữa 2 buổi:</Typography>{' '}
							<Typography>{dataStored?.['required-break-periods'] ?? 0} buổi</Typography>
						</div>
						<div className='w-full flex flex-row justify-start items-baseline gap-2 py-1'>
							<Typography sx={{ color: 'text.secondary' }}>Số ngày nghỉ tối thiểu của giáo viên:</Typography>{' '}
							<Typography>{dataStored?.['minimum-days-off'] ?? 0} ngày</Typography>
						</div>
					</CardContent>
				</CardActionArea>
			</Card>
		</div>
	);
};

export default DetailsGeneralConfiguration;
