'use client';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { useAppContext } from '@/context/app_provider';
import { toggleMenu } from '@/context/school_manager_slice';
import useFetchSchoolYear from '@/hooks/useFetchSchoolYear';
import { ISchoolYearResponse } from '@/utils/constants';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
	IconButton,
	Menu,
	MenuItem,
	styled,
	Tooltip,
	tooltipClasses,
	TooltipProps,
} from '@mui/material';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 13,
	},
}));

const SMHeader = ({ children }: { children: ReactNode }) => {
	const { schoolName, selectedSchoolYearId, setSelectedSchoolYearId } = useAppContext();
	const [selectedSchoolYear, setSelectedSchoolYear] = useState<IDropdownOption<number> | null>(
		null
	);
	const [schoolYearOptions, setSchoolYearIdOptions] = useState<IDropdownOption<number>[]>([]);
	const { data, mutate } = useFetchSchoolYear();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const isMenuOpen: boolean = useSelector((state: any) => state.schoolManager.isMenuOpen);
	const dispatch = useDispatch();

	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleUpdateYear = async (selectedId: number) => {
		setAnchorEl(null);
		const res = await fetch('/api/school', {
			method: 'POST',
			body: JSON.stringify({ schoolYearId: selectedId }),
		});
		if (res.status === 200) {
			setSelectedSchoolYearId(selectedId);
			setSelectedSchoolYear(
				schoolYearOptions.find((item) => item.value === selectedId) ?? null
			);
		}
	};

	const handleToggleMenu = () => {
		dispatch(toggleMenu());
	};

	useEffect(() => {
		if (data?.status === 200) {
			const options: IDropdownOption<number>[] = data.result.map(
				(item: ISchoolYearResponse) => {
					const currentYear = new Date().getFullYear();
					if (
						parseInt(item['start-year']) <= currentYear &&
						parseInt(item['end-year']) >= currentYear &&
						!selectedSchoolYearId
					) {
						handleUpdateYear(item.id);
					}
					if (item.id === selectedSchoolYearId) {
						setSelectedSchoolYear({
							label: `${item['start-year']} - ${item['end-year']}`,
							value: item.id,
						} as IDropdownOption<number>);
					}
					return {
						label: `${item['start-year']} - ${item['end-year']}`,
						value: item.id,
					} as IDropdownOption<number>;
				}
			);
			setSchoolYearIdOptions(options.sort((a, b) => a.label.localeCompare(b.label)));
		}
	}, [data, selectedSchoolYearId]);

	return (
		<div className='w-full min-h-[50px] bg-primary-400 flex flex-row justify-between items-center pl-[1.5vw] pr-2'>
			<div className='w-fit h-full flex flex-row justify-start items-center gap-2'>
				<LightTooltip
					title={!isMenuOpen ? 'Thu gọn Menu' : 'Mở rộng menu'}
					placement='bottom'
					arrow
				>
					<label className='select-none'>
						<div className='w-9 h-10 cursor-pointer flex flex-col items-center justify-center'>
							<input
								className='hidden peer'
								type='checkbox'
								checked={!isMenuOpen}
								onClick={handleToggleMenu}
							/>
							<div className='w-[50%] h-[2px] bg-white rounded-sm transition-all duration-300 origin-left translate-y-[0.45rem] peer-checked:rotate-[-45deg]' />
							<div className='w-[50%] h-[2px] bg-white rounded-md transition-all duration-300 origin-center peer-checked:hidden' />
							<div className='w-[50%] h-[2px] bg-white rounded-md transition-all duration-300 origin-left -translate-y-[0.45rem] peer-checked:rotate-[45deg]' />
						</div>
					</label>
				</LightTooltip>
				{children}
			</div>
			<div className='flex flex-row justify-end items-center gap-3'>
				<IconButton color='primary'>
					<Image
						src='/images/icons/notification-bell.png'
						alt='notification-icon'
						unoptimized={true}
						width={20}
						height={20}
					/>
				</IconButton>
				<div className='w-fit h-full flex flex-col justify-between items-end text-white pr-3'>
					<h3 className='text-body-medium font-medium leading-4 pr-1'>{schoolName}</h3>
					<div
						className='text-[0.75rem] leading-4 opacity-80 flex flex-row justify-between items-center cursor-pointer'
						id='basic-button'
						aria-controls={open ? 'basic-menu' : undefined}
						aria-haspopup='true'
						aria-expanded={open ? 'true' : undefined}
						onClick={handleClick}
					>
						{selectedSchoolYear?.label}
						<KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
					</div>
					<Menu
						id='basic-menu'
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							'aria-labelledby': 'basic-button',
						}}
					>
						{schoolYearOptions.map((option, index) => (
							<MenuItem
								key={option.label + index}
								onClick={() => handleUpdateYear(option.value)}
								sx={
									option.value === selectedSchoolYearId
										? { backgroundColor: '#E0E0E0' }
										: undefined
								}
							>
								{option.label}
							</MenuItem>
						))}
					</Menu>
				</div>
			</div>
		</div>
	);
};

export default SMHeader;
