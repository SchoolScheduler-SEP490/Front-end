'use client';

import SMHeader from '@/commons/school_manager/header';

export default function SMLanding() {
	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-widest'>
						Thời khóa biểu
					</h3>
				</div>
			</SMHeader>
			<h2>TimetableContent here</h2>
		</div>
	);
}
