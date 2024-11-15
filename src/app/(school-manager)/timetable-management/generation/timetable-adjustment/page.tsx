import SMHeader from '@/commons/school_manager/header';

export default function Home() {
	return (
		<div className='w-full h-screen flex flex-col justify-start items-start'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Sắp TKB
					</h3>
				</div>
			</SMHeader>
			<h2>TimetableContent here</h2>
		</div>
	);
}
