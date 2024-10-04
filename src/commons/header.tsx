import { useState } from 'react';

const Header = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const handleDrawerToggle = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};

	return <nav></nav>;
};

export default Header;
