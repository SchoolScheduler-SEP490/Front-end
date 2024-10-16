'use client';
import { ReactNode } from 'react';
import '@/commons/styles/sm_header.css';
import { IconButton } from '@mui/material';
import Image from 'next/image';

const SMHeader = ({ children }: { children: ReactNode }) => {
	return (
		<div className='w-full min-h-[50px] bg-primary-400 flex flex-row justify-between items-center pl-[1.5vw] pr-2'>
			<div className='w-fit h-full flex flex-row justify-start items-center gap-5'>
				<div className='relative w-[30px] h-[80%]'>
					<input id='menuToggler' type='checkbox' />
					<label className='toggle' htmlFor='menuToggler'>
						<div id='bar2' className='bars'></div>
						<div id='bar1' className='bars'></div>
						<div id='bar3' className='bars'></div>
					</label>
				</div>
				{children}
			</div>
			<div>
				<IconButton color='success'>
					<Image
						src='/images/icons/notification-bell.png'
						alt='notification-icon'
						unoptimized={true}
						width={25}
						height={25}
					/>
				</IconButton>
				<IconButton color='success'>
					<Image
						src='/images/icons/three-dot.png'
						alt='notification-icon'
						unoptimized={true}
						width={25}
						height={25}
					/>
				</IconButton>
			</div>
		</div>
	);
};

export default SMHeader;
