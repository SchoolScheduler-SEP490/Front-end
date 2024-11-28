import React, { useState, useEffect } from 'react';
import { Box, Collapse, LinearProgress, Typography } from '@mui/material';

interface LoadingComponentProps {
	isComplete: boolean;
}

const TimetableLoading: React.FC<LoadingComponentProps> = ({ isComplete }) => {
	const [progress, setProgress] = useState<number>(0);
	const [message, setMessage] = useState<string>('Đang phân tích dữ liệu...');

	const [buffer, setBuffer] = React.useState(10);

	const progressRef = React.useRef(() => {});
	React.useEffect(() => {
		progressRef.current = () => {
			if (progress === 100) {
				setProgress(0);
				setBuffer(10);
			} else {
				setProgress(progress + 1);
				if (buffer < 100 && progress % 5 === 0) {
					const newBuffer = buffer + 10 + Math.random() * 10;
					setBuffer(newBuffer > 100 ? 100 : newBuffer);
				}
			}
		};
	});

	React.useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prevProgress) => {
				if (isComplete) return 100;

				if (prevProgress < 80) {
					return prevProgress + 2; // Tăng dần đến 80% trong 5s
				}

				if (prevProgress >= 80 && prevProgress < 90) {
					setMessage('Đang xếp thời khóa biểu...');
					return prevProgress + 0.5; // Tăng chậm hơn giữa 80-90%
				}

				return prevProgress; // Giữ nguyên nếu quá 90%
			});
		}, 200);

		return () => {
			clearInterval(timer);
		};
	}, [isComplete]);

	useEffect(() => {
		if (isComplete) {
			setProgress(100);
			setMessage('Hoàn thành!');
		}
	}, [isComplete]);

	return (
		<Box sx={{ width: '100%', textAlign: 'center' }}>
			<LinearProgress
				color='inherit'
				sx={{ bgcolor: '#fff0eb', color: '#ff6b35', height: 5 }}
			/>
			<Typography
				variant='h6'
				gutterBottom
				sx={{ opacity: '60%', mt: 1, textAlign: 'center' }}
			>
				{message}
			</Typography>
		</Box>
	);
};

export default TimetableLoading;
