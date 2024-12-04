import Image from 'next/image';
import { FC } from 'react';

interface IDashboardNumbersProps {
	// Add your data here
}

const DashboardNumbers: FC<IDashboardNumbersProps> = (props) => {
	const {} = props;
	return (
		<div className='w-full h-fit max-h-[18%] flex flex-row justify-between items-center py-2'>
			<div className='w-[30%] max-w-[300px] h-fit flex flex-col justify-start items-start gap-2 bg-primary-50 rounded-[5px] p-3'>
				<h1 className='w-full overflow-hidden text-ellipsis whitespace-nowrap text-left text-title-small-strong opacity-80'>
					Độ phù hợp TKB
				</h1>
				<div className='w-full h-[50%] flex flex-row justify-start items-center gap-2'>
					<Image
						unoptimized
						src='/images/icons/energy.png'
						alt=''
						width={50}
						height={50}
						className='bg-white p-2 rounded-[5px]'
					/>
					<div className='w-full h-fit pt-2 flex flex-col justify-end gap-1'>
						<h1 className='text-title-large-strong font-bold leading-4'>100%</h1>
						<p className='text-body-large-strong opacity-60'>Trung bình mỗi TKB</p>
					</div>
				</div>
			</div>
			<div className='w-[30%] max-w-[300px] h-fit flex flex-col justify-start items-start gap-2 bg-primary-50 rounded-[5px] p-3'>
				<h1 className='w-full overflow-hidden text-ellipsis whitespace-nowrap text-left text-title-small-strong opacity-80'>
					Thời gian tạo trung bình
				</h1>
				<div className='w-full h-[50%] flex flex-row justify-start items-center gap-2'>
					<Image
						unoptimized
						src='/images/icons/dumbbell.png'
						alt=''
						width={50}
						height={50}
						className='bg-white p-2 rounded-[5px]'
					/>
					<div className='w-full h-fit pt-2 flex flex-col justify-end gap-1'>
						<h1 className='text-title-large-strong font-bold leading-4'>6.8</h1>
						<p className='text-body-large-strong opacity-60'>phút / Thời khóa biểu</p>
					</div>
				</div>
			</div>
			<div className='w-[30%] max-w-[300px] h-fit flex flex-col justify-start items-start gap-2 bg-primary-50 rounded-[5px] p-3'>
				<h1 className='w-full h-fit overflow-hidden text-ellipsis whitespace-nowrap text-left text-title-small-strong opacity-80'>
					Số trường sử dụng
				</h1>
				<div className='w-full h-[50%] flex flex-row justify-between items-start gap-2'>
					<Image
						unoptimized
						src='/images/icons/school.png'
						alt=''
						width={50}
						height={50}
						className='bg-white p-2 rounded-[5px]'
					/>
					<div className='w-full h-fit pt-2 flex flex-col justify-end gap-1'>
						<h1 className='text-title-large-strong font-bold leading-4'>1.200</h1>
						<p className='text-body-large-strong opacity-60'>Trên khắp cả nước</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardNumbers;
