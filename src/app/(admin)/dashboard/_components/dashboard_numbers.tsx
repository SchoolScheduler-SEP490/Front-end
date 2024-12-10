import Image from 'next/image';
import { FC } from 'react';
import { ITotalNumberObject } from '../_libs/constants';

interface IDashboardNumbersProps {
	data: ITotalNumberObject;
}

const formatNumber = (num: number): string => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const DashboardNumbers: FC<IDashboardNumbersProps> = (props) => {
	const { data } = props;
	return (
		<div className='w-full h-fit max-h-[18%] flex flex-row justify-between items-center py-2'>
			<div className='w-[23%] max-w-[250px] h-fit flex flex-col justify-start items-start gap-2 bg-primary-50 rounded-[5px] p-2'>
				<h1 className='w-full overflow-hidden text-ellipsis whitespace-nowrap text-left text-body-medium-strong font-medium opacity-80'>
					Độ phù hợp TKB
				</h1>
				<div className='w-full h-[50%] flex flex-row justify-start items-center gap-2'>
					<Image
						unoptimized
						src='/images/icons/energy.png'
						alt=''
						width={40}
						height={40}
						className='bg-white p-2 rounded-[5px]'
					/>
					<div className='w-full h-fit pt-1 flex flex-col justify-start gap-1'>
						<h1 className='text-title-small-strong font-bold leading-3'>
							{Math.floor(data?.averageFitness ?? 0)}%
						</h1>
						<p className='text-body-small font-normal opacity-60'>/ mỗi TKB</p>
					</div>
				</div>
			</div>
			<div className='w-[23%] max-w-[250px] h-fit flex flex-col justify-start items-start gap-2 bg-primary-50 rounded-[5px] p-2'>
				<h1 className='w-full overflow-hidden text-ellipsis whitespace-nowrap text-left text-body-medium-strong font-medium opacity-80'>
					Thời gian tạo trung bình
				</h1>
				<div className='w-full h-[50%] flex flex-row justify-start items-center gap-2'>
					<Image
						unoptimized
						src='/images/icons/dumbbell.png'
						alt=''
						width={40}
						height={40}
						className='bg-white p-2 rounded-[5px]'
					/>
					<div className='w-full h-fit pt-1 flex flex-col justify-start gap-1'>
						<h1 className='text-title-small-strong font-bold leading-3'>
							{((data?.averageTimeCost ?? 0) / 60).toFixed(1)}
						</h1>
						<p className='text-body-small font-normal opacity-60'>phút / TKB</p>
					</div>
				</div>
			</div>
			<div className='w-[23%] max-w-[250px] h-fit flex flex-col justify-start items-start gap-2 bg-primary-50 rounded-[5px] p-2'>
				<h1 className='w-full h-fit overflow-hidden text-ellipsis whitespace-nowrap text-left text-body-medium-strong font-medium opacity-80'>
					Số trường sử dụng
				</h1>
				<div className='w-full h-[50%] flex flex-row justify-between items-start gap-2'>
					<Image
						unoptimized
						src='/images/icons/school.png'
						alt=''
						width={40}
						height={40}
						className='bg-white p-2 rounded-[5px]'
					/>
					<div className='w-full h-fit pt-1 flex flex-col justify-start gap-1'>
						<h1 className='text-title-small-strong font-bold leading-3'>
							{formatNumber(data?.totalSchoolUsed ?? 0)}
						</h1>
						<p className='text-body-small font-normal opacity-60'>Trường / cả nước</p>
					</div>
				</div>
			</div>
			<div className='w-[23%] max-w-[250px] h-fit flex flex-col justify-start items-start gap-2 bg-primary-50 rounded-[5px] p-2'>
				<h1 className='w-full h-fit overflow-hidden text-ellipsis whitespace-nowrap text-left text-body-medium-strong font-medium opacity-80'>
					Trung bình TKB/Trường
				</h1>
				<div className='w-full h-[50%] flex flex-row justify-between items-start gap-2'>
					<Image
						unoptimized
						src='/images/icons/school.png'
						alt=''
						width={40}
						height={40}
						className='bg-white p-2 rounded-[5px]'
					/>
					<div className='w-full h-fit pt-1 flex flex-col justify-start gap-1'>
						<h1 className='text-title-small-strong font-bold leading-3'>
							{formatNumber(data?.averageTimetablePerSchool ?? 0)}
						</h1>
						<p className='text-body-small font-normal opacity-60'>TKB / trường</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardNumbers;
