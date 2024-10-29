'use client';
import { ReactNode } from 'react';
import '@/commons/styles/sm_header.css';
import { IconButton } from '@mui/material';
import Image from 'next/image';

const SMHeader = ({ children }: { children: ReactNode }) => {
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
			<div>
				<IconButton color='primary'>
					<Image
						src='/images/icons/notification-bell.png'
						alt='notification-icon'
						unoptimized={true}
						width={20}
						height={20}
					/>
				</IconButton>
				<IconButton color='primary'>
					<Image
						src='/images/icons/three-dot.png'
						alt='notification-icon'
						unoptimized={true}
						width={20}
						height={20}
					/>
				</IconButton>
			</div>
		</div>
	);
};

export default SMHeader;
