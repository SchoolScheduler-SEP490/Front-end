'use client';
import { usePathname, useRouter } from 'next/navigation';

const SMConstraintPage = () => {
	const router = useRouter();
	const pathName = usePathname();
	router.replace(pathName + '/general-configurations');
};
export default SMConstraintPage;
