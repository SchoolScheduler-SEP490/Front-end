'use client';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import '@/commons/styles/sm_header.css';
import { useAppContext } from '@/context/app_provider';
import useFetchSchoolYear from '@/hooks/useFetchSchoolYear';
import { ISchoolYearResponse } from '@/utils/constants';
import { IconButton, Menu, MenuItem } from '@mui/material';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import useNotify from '@/hooks/useNotify';

const SMHeader = ({ children }: { children: ReactNode }) => {
	const { schoolName, selectedSchoolYearId, setSelectedSchoolYearId } = useAppContext();
	const [selectedSchoolYear, setSelectedSchoolYear] = useState<IDropdownOption<number> | null>(
		null
	);
	const [schoolYearOptions, setSchoolYearIdOptions] = useState<IDropdownOption<number>[]>([]);
	const { data, mutate } = useFetchSchoolYear();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMenuItemClick = async (
		event: React.MouseEvent<HTMLElement>,
		selectedId: number
	) => {
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

	useEffect(() => {
		mutate();
		if (data?.status === 200) {
			const options: IDropdownOption<number>[] = data.result.map(
				(item: ISchoolYearResponse) => {
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
			<div className='w-fit h-full flex flex-row justify-start items-center gap-5'>
				{/* <label className='flex flex-col gap-2 w-8'>
					<input className='peer hidden' type='checkbox' />
					<div className='rounded-2xl h-[3px] w-1/2 bg-black duration-500 peer-checked:rotate-[225deg] origin-right peer-checked:-translate-x-[12px] peer-checked:-translate-y-[1px]'></div>
					<div className='rounded-2xl h-[3px] w-full bg-black duration-500 peer-checked:-rotate-45'></div>
					<div className='rounded-2xl h-[3px] w-1/2 bg-black duration-500 place-self-end peer-checked:rotate-[225deg] origin-left peer-checked:translate-x-[12px] peer-checked:translate-y-[1px]'></div>
				</label> */}
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
								onClick={(event) => handleMenuItemClick(event, option.value)}
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
