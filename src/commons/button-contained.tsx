'use client';

import { inter } from '@/utils/fonts';
import { Button, styled } from '@mui/material';

const CustomButton = styled(Button)({
	borderRadius: 0,
	boxShadow: 'none',
	padding: '10px 12px',
	backgroundColor: 'var(--primary-normal)',
	fontFamily: [inter].join(','),
});

interface IButtonProps {
	title: string;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	disableRipple?: boolean;
	styles?: string;
	textStyles?: string;
}

const ContainedButton = (props: IButtonProps) => {
	const { title, onClick, type, disableRipple, disabled, styles, textStyles } = props;

	return (
		<CustomButton
			variant='contained'
			disableRipple={disableRipple}
			type={type}
			className={styles}
			disabled={disabled}
			onClick={onClick}
		>
			<h4 className={textStyles}>{title}</h4>
		</CustomButton>
	);
};

export default ContainedButton;
