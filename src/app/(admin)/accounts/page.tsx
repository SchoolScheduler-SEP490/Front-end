'use client';
import { useAppContext } from '@/context/app_provider';
import { useEffect, useState } from 'react';
import { IAccountResponse } from './_libs/constants';
import useFetchAccounts from './_hooks/useFetchAccounts';
import AccountsTable from './_components/accounts_table';
import AdminHeader from '@/commons/admin/header';
import { useAdminSelector } from '@/hooks/useReduxStore';
import { IAdminState } from '@/context/slice_admin';
import { ACCOUNT_STATUS } from '../_utils/constants';
import AccountTableSkeleton from './_components/skeleton_table';
import { preconnect } from 'react-dom';
import AccountsFilterable from './_components/accounts_filterable';

export default function UserPage() {
	const { sessionToken } = useAppContext();
	const { isMenuOpen }: IAdminState = useAdminSelector((state) => state.admin);

	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [totalRows, setTotalRows] = useState<number | undefined>(undefined);

	const [isFilterableModalOpen, setIsFilterableModalOpen] = useState<boolean>(false);
	const [selectedAccountStatus, setSelectedAccountStatus] = useState<string>('All');

	const [accountData, setAccountData] = useState<IAccountResponse[]>([]);

	const {
		data: accountResponse,
		mutate: updateAccount,
		isValidating: isAccountValidating,
	} = useFetchAccounts({
		sessionToken,
		pageIndex: 1,
		pageSize: 999999,
		...(selectedAccountStatus !== 'All' && { accountStatus: selectedAccountStatus }),
	});

	useEffect(() => {
		setAccountData([]);
		updateAccount();
		if (accountResponse?.status === 200) {
			const tmpAccountData: IAccountResponse[] = [];
			Object.entries(ACCOUNT_STATUS).forEach(([key, value]) => {
				const accountsByStatus: IAccountResponse[] = accountResponse.result.items.filter(
					(item: IAccountResponse) =>
						item.status === key && !accountData.some((existing) => existing.id === item.id)
				);
				tmpAccountData.push(...accountsByStatus);
			});

			setAccountData((prev) => [...prev, ...tmpAccountData]);
			setTotalRows(accountResponse.result['total-item-count']);
		}
	}, [accountResponse]);

	return (
		<div
			className={`w-[${
				!isMenuOpen ? '84' : '100'
			}%] h-screen flex flex-col justify-start items-start`}
		>
			<AdminHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Quản lý người dùng
					</h3>
				</div>
			</AdminHeader>
			<div
				className={`w-full h-max pt-[3vh] ${
					isFilterableModalOpen
						? 'flex flex-row justify-between items-start px-[1vw] gap-[1vw]'
						: 'px-[5vw]'
				}`}
			>
				<div className='w-full h-max max-h-[90vh] overflow-y-scroll no-scrollbar p-1'>
					<AccountsTable
						data={accountData}
						page={page}
						setPage={setPage}
						rowsPerPage={rowsPerPage}
						setRowsPerPage={setRowsPerPage}
						totalRows={totalRows}
						selectedAccountStatus={selectedAccountStatus}
						setIsFilterableModalOpen={setIsFilterableModalOpen}
					/>
				</div>
				<AccountsFilterable
					open={isFilterableModalOpen}
					setOpen={setIsFilterableModalOpen}
					selectedAccountStatus={selectedAccountStatus}
					setSelectedAccountStatus={setSelectedAccountStatus}
				/>
			</div>
		</div>
	);
}
