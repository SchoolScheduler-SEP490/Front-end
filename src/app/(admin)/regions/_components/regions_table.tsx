import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Divider,
	Grid,
	IconButton,
	ListItemText,
	Skeleton,
	TextField,
	Typography,
} from '@mui/material';
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react';
import { IDistrictResponse, IProvinceResponse } from '../_libs/constants';

interface IRegionsTableProps {
	data: IProvinceResponse[];
	selectedProvinceId: number;
	setSelectedProvinceId: Dispatch<SetStateAction<number>>;
	districtData: IDistrictResponse[];
	isDistrictValidating: boolean;
	handleUpdateProvince: (provinceId: number) => void;
}

const RegionsTable: FC<IRegionsTableProps> = (props) => {
	const {
		data,
		setSelectedProvinceId,
		districtData,
		isDistrictValidating,
		selectedProvinceId,
		handleUpdateProvince,
	} = props;

	const [searchTerm, setSearchTerm] = useState<string>('');
	const [expanded, setExpanded] = useState<number | false>(false);
	const [selectedDistrictData, setSelectedDistrictData] = useState<IDistrictResponse[]>([]);

	useEffect(() => {
		if (districtData.length > 0 && selectedProvinceId === expanded) {
			setSelectedDistrictData(districtData);
		}
	}, [districtData]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value.toLowerCase());
	};

	const filteredProvinces: IProvinceResponse[] = useMemo((): IProvinceResponse[] => {
		return data.filter((province) => province.name.toLowerCase().includes(searchTerm));
	}, [searchTerm, data]);

	const handleChange =
		(provinceId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? provinceId : false);
			if (isExpanded) {
				setSelectedProvinceId(provinceId);
			}
		};

	return (
		<Box sx={{ margin: 'auto', mt: 2 }}>
			{/* Search Bar */}
			<TextField
				label='Tìm kiếm tỉnh'
				variant='outlined'
				fullWidth
				autoComplete='off'
				onChange={handleSearch}
				sx={{ mb: 2 }}
			/>

			{/* Accordion for each province */}
			{filteredProvinces.map((province) => (
				<Accordion
					key={province.id}
					expanded={expanded === province.id}
					onChange={handleChange(province.id)}
				>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						sx={{
							flexDirection: 'row-reverse', // Đảo ngược icon và nội dung
							'& .MuiAccordionSummary-content': {
								marginLeft: 1, // Thêm khoảng cách giữa icon và nội dung
							},
							'&:hover': {
								color: 'primary.main',
								backgroundColor: 'action.hover',
							},
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								width: '100%',
							}}
						>
							<Typography>{province.name}</Typography>
							<IconButton
								size='small'
								color='primary'
								onClick={(e) => {
									e.stopPropagation();
									handleUpdateProvince(province.id);
								}}
							>
								<AddIcon />
							</IconButton>
						</Box>
					</AccordionSummary>

					{/* Accordion Details */}
					<AccordionDetails>
						<Divider variant='middle' orientation='horizontal' />
						{!isDistrictValidating && selectedDistrictData.length === 0 && (
							<h3 className='text-body-small italic opacity-60 w-full text-center pt-2'>
								Chưa có quận huyện nào trong tỉnh này
							</h3>
						)}
						<Grid container spacing={2} sx={{ px: 3, mt: 1 }}>
							{isDistrictValidating
								? [1, 2, 3, 4, 5, 6].map((index) => (
										<Grid item xs={4} key={index}>
											<Skeleton variant='text' width='100%' animation='wave' />
										</Grid>
								  ))
								: selectedDistrictData.map((district, index) => (
										<Grid item xs={4} key={index}>
											<ListItemText primary={district.name} />
										</Grid>
								  ))}
						</Grid>
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	);
};

export default RegionsTable;
