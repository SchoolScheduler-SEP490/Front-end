import './_styles/notfound_style.css';

export default function NotFound() {
	return (
		<div id='notfound' className='w-screen h-screen flex justify-center items-center'>
			<div className='notfound'>
				<div className='notfound-404'>
					{/* <h3 className='text-red-600 !text-title-large !font-bold'>
						Không thể tìm thấy trang
					</h3> */}
					<h1>
						<span className='text-primary-500'>4</span>
						<span className='text-primary-500'>0</span>
						<span className='text-primary-500'>4</span>
					</h1>
				</div>
				<h2 className='!mt-3'>
					Chúng tôi không thể tìm thấy trang mà bạn yêu cầu
				</h2>
			</div>
		</div>
	);
}
