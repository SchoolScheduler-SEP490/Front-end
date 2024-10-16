import SMHeader from '@/commons/school_manager/header';

export default function Home() {
	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Phân công giảng dạy
					</h3>
				</div>
			</SMHeader>
			<h2>Your content here</h2>
		</div>
	);
}
