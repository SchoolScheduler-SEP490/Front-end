import { Backdrop, CircularProgress } from '@mui/material';

interface ILoadingComponentProps {
	loadingStatus: boolean;
}
const LoadingComponent = ({ loadingStatus }: ILoadingComponentProps) => {
	return (
		<Backdrop
			sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
			open={loadingStatus}
		>
			<CircularProgress color='inherit' />
		</Backdrop>
	);
};

export default LoadingComponent;
