import ContainedButton from '@/commons/button-contained';
import SMHeader from '@/commons/school_manager/header';
import { Button } from '@mui/material';
import Image from 'next/image';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';

export default function Home() {
	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Nhập thời khóa biểu
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-[70vh] flex flex-col justify-center items-center gap-2'>
				<Image
					src='/images/icons/Import.png'
					alt='import-timetable'
					width={100}
					height={100}
					unoptimized={true}
					className='!opacity-60'
				/>
				<h1 className='text-title-medium-strong w-[35vw] text-justify'>
					Nhập dữ liệu Thời khóa biểu từ bên ngoài vào hệ thống
				</h1>
				<p className='text-body-large w-[35vw] text-justify opacity-60'>
					Lựa chọn tải lên thời khóa biểu từ thiết bị của bạn hoặc đường dẫn của một tài
					liệu được lưu trữ trên đám mây từ cơ quan của bạn.
				</p>
				<div className='w-[35vw] mt-2 flex flex-row justify-between items-center'>
					<Button
						variant='outlined'
						color='inherit'
						sx={{
							borderColor: '#175b8e',
							color: '#004e89',
							borderRadius: 0,
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							gap: '3px',
						}}
					>
						Tải về tài liệu mẫu
						<DownloadIcon color='inherit' sx={{ fontSize: 17 }} />
					</Button>
					<Button
						variant='contained'
						color='inherit'
						sx={{
							bgcolor: '#175b8e',
							color: 'white',
							borderRadius: 0,
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							gap: '3px',
						}}
					>
						tải lên tài liệu
						<UploadIcon color='inherit' sx={{ fontSize: 17 }} />
					</Button>
				</div>
			</div>
		</div>
	);
}
