import { WEEK_DAYS_FULL } from '@/utils/constants';
import { Typography } from '@mui/material';
import {
	BarController,
	BarElement,
	CategoryScale,
	ChartData,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineController,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js';
import { FC } from 'react';
import { Chart } from 'react-chartjs-2';

interface IDashboardGraphProps {
	// Add your data here
}

const DashboardGraph: FC<IDashboardGraphProps> = () => {
	ChartJS.register(
		BarController,
		LineController,
		BarElement,
		LineElement,
		LinearScale,
		CategoryScale,
		PointElement,
		Title,
		Tooltip,
		Legend
	);

	const data: ChartData<'bar' | 'line', number[], string> = {
		labels: WEEK_DAYS_FULL,
		datasets: [
			{
				type: 'line', // Biểu đồ đường
				label: 'Độ phù hợp trung bình (%)',
				data: [60, 70, 80, 65, 75, 100],
				borderColor: '#ff6b35',
				backgroundColor: '#ff6b35',
				borderWidth: 3,
			},
			{
				type: 'bar', // Biểu đồ cột
				label: 'Số lượng TKB đã tạo',
				data: [50, 100, 80, 120, 150, 200],
				backgroundColor: '#1a659e',
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
		},
		scales: {
			x: {
				grid: {
					display: false, // Tắt grid dọc
				},
			},
			y: {
				grid: {
					display: true, // Giữ grid ngang
				},
				beginAtZero: true,
			},
		},
	};

	return (
		<div className='relative w-full max-h-[45%] flex flex-col justify-center items-center'>
			<Typography variant='h6' sx={{ p: 2, width: '100%' }}>
				Top trường sử dụng
			</Typography>
			<div className='w-[70%] h-[70%]'>
				<Chart data={data} options={options} type='bar' />
			</div>
		</div>
	);
};

export default DashboardGraph;
