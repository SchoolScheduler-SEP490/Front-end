'use client';
import AdminHeader from '@/commons/admin/header';
import { useAppContext } from '@/context/app_provider';
import { IAdminState } from '@/context/slice_admin';
import { useAdminSelector } from '@/hooks/useReduxStore';
import { useEffect, useState } from 'react';
import { ACCOUNT_STATUS } from '../_utils/constants';
import AccountsFilterable from './_components/accounts_filterable';
import AccountsTable from './_components/accounts_table';
import useFetchAccounts from './_hooks/useFetchAccounts';
import { IAccountResponse } from './_libs/constants';

export default function UserPage() {
	const { sessionToken } = useAppContext();
	const { isMenuOpen }: IAdminState = useAdminSelector((state) => state.admin);

	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [totalRows, setTotalRows] = useState<number | undefined>(undefined);

	const [isFilterableModalOpen, setIsFilterableModalOpen] = useState<boolean>(true);
	const [selectedAccountStatus, setSelectedAccountStatus] = useState<string>('All');

	const [accountData, setAccountData] = useState<IAccountResponse[]>([]);

	const {
		data: accountResponse,
		mutate: updateAccount,
		isValidating: isAccountValidating,
	} = useFetchAccounts({
		sessionToken,
		pageIndex: page + 1,
		pageSize: rowsPerPage,
		...(selectedAccountStatus !== 'All' && { accountStatus: selectedAccountStatus }),
	});

	useEffect(() => {
		setAccountData([]);
		updateAccount();
		if (accountResponse?.status === 200) {
			setAccountData(accountResponse.result.items);
			setTotalRows(accountResponse.result['total-item-count']);
		}
	}, [accountResponse, page, rowsPerPage, selectedAccountStatus]);

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
						updateData={updateAccount}
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
