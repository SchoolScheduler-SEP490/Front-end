'use client';

import SMHeader from '@/commons/school_manager/header';
import * as React from 'react';
import { IRoomTableData } from './_libs/constants';
import RoomTable from './_components/room_table';

export default function SMRoom() {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [roomTableData, setRoomTableData] = React.useState<IRoomTableData[]>([]);
	const [totalRows, setTotalRows] = React.useState<number | undefined>(undefined);

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Lớp học
					</h3>
				</div>
			</SMHeader>
			<RoomTable
				roomTableData={roomTableData ?? []}
				serverPage={page}
				setServerPage={setPage}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
				totalRows={totalRows}
			/>
		</div>
	);
}
