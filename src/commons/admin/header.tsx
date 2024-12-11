'use client';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import '@/commons/styles/sm_header.css';
import { useAppContext } from '@/context/app_provider';
import { IAdminState, toggleMenu } from '@/context/slice_admin';
import useFetchSchoolYear from '@/hooks/useFetchSchoolYear';
import { useAdminDispatch, useAdminSelector } from '@/hooks/useReduxStore';
import { ISchoolYearResponse } from '@/utils/constants';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import {
	IconButton,
	Menu,
	MenuItem,
	styled,
	Tabs,
	Tooltip,
	tooltipClasses,
	TooltipProps,
} from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

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

const StyledTabs = styled(Tabs)({
	'& .MuiTabs-indicator': {
		display: 'none',
	},
	'& .MuiTab-root': {
		padding: 0,
		color: 'var(--basic-gray)',
		fontSize: 'var(--font-size-12)',
		fontWeight: 400,
		textTransform: 'none',
		alignItems: 'flex-start',
		textAlign: 'left',
		minWidth: 'fit-content',
		marginRight: '16px',
		'&:hover': {
			backgroundColor: 'transparent',
			color: 'var(--primary-normal-hover)',
		},
	},
	'& .Mui-selected': {
		color: 'var(--primary-normal-active) !important',
		fontWeight: 'bold',
		backgroundColor: 'transparent',
	},
});

const AdminHeader = ({ children }: { children: ReactNode }) => {
	const { userRole, selectedSchoolYearId, setSelectedSchoolYearId } = useAppContext();
	const [selectedSchoolYear, setSelectedSchoolYear] = useState<IDropdownOption<number> | null>(
		null
	);
	const [schoolYearOptions, setSchoolYearIdOptions] = useState<IDropdownOption<number>[]>([]);
	const { data, mutate } = useFetchSchoolYear({ includePrivate: true });
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	// const [activeTab, setActiveTab] = useState(0);
	// const { notifications, unreadCount, markAsRead, fetchUnreadCount, markAllAsRead } =
	// 	useNotification();
	// const [showNotifications, setShowNotifications] = useState(false);
	const { isMenuOpen }: IAdminState = useAdminSelector((state) => state.admin);
	const dispatch = useAdminDispatch();

	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleToggleMenu = () => {
		dispatch(toggleMenu());
	};

	const handleUpdateYear = async (selectedId: number) => {
		setAnchorEl(null);
		const res = await fetch('/api/school', {
			method: 'POST',
			body: JSON.stringify({ schoolYearId: selectedId }),
		});
		if (res.status === 200) {
			setSelectedSchoolYearId(selectedId);
			setSelectedSchoolYear(schoolYearOptions.find((item) => item.value === selectedId) ?? null);
		}
	};

	useEffect(() => {
		if (data?.status === 200) {
			const options: IDropdownOption<number>[] = data.result.map((item: ISchoolYearResponse) => {
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
			});
			setSchoolYearIdOptions(options.sort((a, b) => a.label.localeCompare(b.label)));
		}
	}, [data, selectedSchoolYearId]);

	// useEffect(() => {
	// 	fetchUnreadCount();
	// }, [notifications]);

	// const filteredNotifications =
	// 	activeTab === 0
	// 		? notifications.filter(
	// 				(notification) =>
	// 					new Date(notification['create-date']).toDateString() === new Date().toDateString()
	// 		  )
	// 		: notifications.filter(
	// 				(notification) =>
	// 					new Date(notification['create-date']).toDateString() !== new Date().toDateString()
	// 		  );

	// const handleChange = (event: React.SyntheticEvent, newValue: number) => {
	// 	setActiveTab(newValue);
	// };

	return (
		<div className='w-full min-h-[50px] bg-primary-500 flex flex-row justify-between items-center pl-[1.5vw] pr-2'>
			<div className='w-fit h-full flex flex-row justify-start items-center gap-5'>
				<LightTooltip
					title={!isMenuOpen ? 'Thu gọn Menu' : 'Mở rộng menu'}
					placement='bottom'
					arrow
				>
					<IconButton onClick={handleToggleMenu}>
						{!isMenuOpen ? (
							<MenuOpenIcon color='inherit' sx={{ color: 'white' }} />
						) : (
							<MenuIcon color='inherit' sx={{ color: 'white' }} />
						)}
					</IconButton>
				</LightTooltip>
				{children}
			</div>
			<div className='flex flex-row justify-end items-center gap-3'>
				{/* <div className='relative'>
					<IconButton color='primary' onClick={() => setShowNotifications(!showNotifications)}>
						<div className='relative'>
							<Image
								src='/images/icons/notification-bell.png'
								alt='notification-icon'
								unoptimized={true}
								width={20}
								height={20}
							/>
							<span className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center'>
								{unreadCount}
							</span>
						</div>
					</IconButton>

					{showNotifications && (
						<div className='absolute right-0 top-12 min-w-96 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto no-scrollbar'>
							<div className='p-4'>
								<div className='flex justify-between items-center mb-2'>
									<h5 className='text-lg font-semibold'>Thông báo</h5>
								</div>
								<div className='flex justify-between items-center'>
									<StyledTabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
										<Tab label='Hôm nay' disableRipple />
										<Tab label='Trước đó' disableRipple />
									</StyledTabs>
									<button
										onClick={markAllAsRead}
										className='text-sm text-primary-300 hover:text-primary-500 hover:font-semibold flex items-center gap-1 whitespace-nowrap'
									>
										<Image
											src='/images/icons/double-tick.png'
											alt='double-tick'
											width={16}
											height={16}
											unoptimized={true}
										/>
										Đánh dấu tất cả
									</button>
								</div>
								{notifications.length > 0 ? (
									notifications.map((notification, index) => (
										<div
											key={index}
											className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
												!notification['is-read'] ? 'bg-blue-50' : ''
											}`}
											onClick={() => {
												markAsRead(notification['notification-url']);
												if (notification.link) {
													window.location.href = notification.link;
												}
											}}
										>
											<div className='font-medium'>{notification.title}</div>
											<div className='text-sm text-gray-600'>{notification.message}</div>
											<div className='text-xs text-gray-400 mt-1'>
												{new Date(notification['create-date']).toLocaleString()}
											</div>
										</div>
									))
								) : (
									<div className='text-center text-gray-500 py-4'>Không có thông báo !</div>
								)}
							</div>
						</div>
					)}
				</div> */}
				<div className='w-fit h-full flex flex-col justify-between items-end text-white pr-3'>
					<h3 className='text-body-medium font-medium leading-4 pr-1'>{userRole}</h3>
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
									option.value === selectedSchoolYearId ? { backgroundColor: '#E0E0E0' } : undefined
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

export default AdminHeader;
