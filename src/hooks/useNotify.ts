import { Bounce, toast } from 'react-toastify';

interface INotifyProps {
	message: string;
	position?:
		| 'top-right'
		| 'top-left'
		| 'bottom-right'
		| 'bottom-left'
		| 'top-center'
		| 'bottom-center';
	type: 'success' | 'error' | 'info' | 'warning' | 'default';
	variant?: 'light' | 'dark' | 'colored';
	autoClose?: number;
}

const useNotify = ({ message, type, autoClose, position, variant }: INotifyProps): void => {
	switch (type) {
		case 'success':
			toast.success(message, {
				position: position || 'top-right',
				autoClose: autoClose || 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: variant || 'light',
				transition: Bounce,
			});
			break;
		case 'error':
			toast.error(message, {
				position: position || 'top-right',
				autoClose: autoClose || 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: variant || 'light',

				transition: Bounce,
			});
			break;
		case 'info':
			toast.info(message, {
				position: position || 'top-right',
				autoClose: autoClose || 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: variant || 'light',
				transition: Bounce,
			});
			break;
		case 'warning':
			toast.warning(message, {
				position: position || 'top-right',
				autoClose: autoClose || 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: variant || 'light',
				transition: Bounce,
			});
			break;
		case 'default':
			toast(message, {
				position: position || 'top-right',
				autoClose: autoClose || 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: variant || 'light',
				transition: Bounce,
			});
			break;
		default:
			break;
	}
};

export default useNotify;
