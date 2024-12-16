'use client';

import { CLASSGROUP_STRING_TYPE } from '@/utils/constants';
import AddIcon from '@mui/icons-material/Add';
import LayersIcon from '@mui/icons-material/Layers';
import { styled, Toolbar, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import Image from 'next/image';
import * as React from 'react';
import { KeyedMutator } from 'swr';
import { ICurriculumTableData } from '../_libs/constants';
import CreateCurriculumModal from './curiculumn_modal_create';
import DeleteCurriculumModal from './curiculumn_modal_delete';
import { usePathname, useRouter } from 'next/navigation';
import { PathnameContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 11,
	},
}));

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof ICurriculumTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof ICurriculumTableData,
		centered: false,
		disablePadding: false,
		label: 'STT',
	},
	{
		id: 'subjectGroupName' as keyof ICurriculumTableData,
		centered: false,
		disablePadding: false,
		label: 'Tên Khung chương trình',
	},
	{
		id: 'subjectGroupCode' as keyof ICurriculumTableData,
		centered: false,
		disablePadding: false,
		label: 'Mã Khung chương trình',
	},
	{
		id: 'grade' as keyof ICurriculumTableData,
		centered: false,
		disablePadding: false,
		label: 'Khối áp dụng',
	},
];

// For extrafunction of Table head (filter, sort, etc.)
interface EnhancedTableProps {
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ICurriculumTableData) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, rowCount, onRequestSort } = props;
	const createSortHandler =
		(property: keyof ICurriculumTableData) => (event: React.MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.centered ? 'center' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
						sx={[{ fontWeight: 'bold' }, headCell.centered ? { paddingLeft: '3%' } : {}]}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component='span' sx={[visuallyHidden, { position: 'absolute', zIndex: 10 }]}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
				<TableCell>
					<h2 className='font-semibold text-white'>CN</h2>
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

interface ICurriculumTableProps {
	curriculumTableData: ICurriculumTableData[];
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	rowsPerPage: number;
	setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
	totalRows?: number;
	mutate: KeyedMutator<any>;
	selectedCurriculumId: number;
	setSelectedCurriculumId: React.Dispatch<React.SetStateAction<number>>;
}

const GRADE_COLOR: { [key: number]: string } = {
	10: '#ff6b35',
	11: 'black',
	12: '#004e89',
};
const CurriculumTable = (props: ICurriculumTableProps) => {
	const {
		curriculumTableData,
		page,
		setPage,
		rowsPerPage,
		setRowsPerPage,
		totalRows,
		mutate,
		selectedCurriculumId,
		setSelectedCurriculumId,
	} = props;
	const router = useRouter();
	const pathName = usePathname();

	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof ICurriculumTableData>('grade');
	const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);
	const [selectedRow, setSelectedRow] = React.useState<ICurriculumTableData | undefined>();

	const handleApplyCurriculum = () => {
		// Add apply logics here
	};

	const handleDeleteClick = (
		event: React.MouseEvent<HTMLButtonElement>,
		row: ICurriculumTableData
	) => {
		event.stopPropagation();
		setSelectedRow(row);
		setIsDeleteModalOpen(true);
	};

	const handleViewDetails = (row: ICurriculumTableData) => {
		setSelectedCurriculumId(row.curriculumKey);
		router.push(pathName + '/' + row.curriculumKey);
	};

	const handleAddSubject = () => {
		setIsAddModalOpen(true);
	};

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof ICurriculumTableData
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value));
	};

	const emptyRows =
		curriculumTableData.length < rowsPerPage && rowsPerPage < 10
			? rowsPerPage - curriculumTableData.length
			: 0;

	const visibleRows: ICurriculumTableData[] = React.useMemo((): ICurriculumTableData[] => {
		return curriculumTableData ? [...curriculumTableData].sort(getComparator(order, orderBy)) : [];
	}, [order, orderBy, page, rowsPerPage]);
	return (
		<div className='w-full h-fit flex flex-row justify-center items-center gap-6 px-1 pt-[2vh]'>
			<Box sx={{ width: '100%' }}>
				<Paper sx={{ width: '100%', mb: 2 }}>
					<Toolbar
						sx={[
							{
								pl: { sm: 2 },
								pr: { xs: 1, sm: 1 },
								width: '100%',
							},
						]}
					>
						<h2 className='text-title-medium-strong font-semibold w-full text-left'>
							Khung chương trình
						</h2>
						<div className='w-fit h-fit flex flex-row justify-center items-center'>
							<LightTooltip title='Thêm Khung chương trình'>
								<IconButton onClick={handleAddSubject}>
									<AddIcon />
								</IconButton>
							</LightTooltip>
							{/* <LightTooltip title='Áp dụng Khung chương trình' arrow>
								<IconButton onClick={handleApplyCurriculum}>
									<LayersIcon />
								</IconButton>
							</LightTooltip> */}
						</div>
					</Toolbar>
					<TableContainer>
						<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='medium'>
							<EnhancedTableHead
								order={order}
								orderBy={orderBy}
								onRequestSort={handleRequestSort}
								rowCount={curriculumTableData.length}
							/>
							<TableBody>
								{visibleRows.length === 0 && (
									<TableRow>
										<TableCell colSpan={6} align='center'>
											<h1 className='text-body-large-strong italic text-basic-gray'>
												Khung chương trình chưa có dữ liệu
											</h1>
										</TableCell>
									</TableRow>
								)}
								{visibleRows.map((row, index) => {
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											role='checkbox'
											tabIndex={-1}
											key={row.id}
											sx={[{ userSelect: 'none' }]}
										>
											<TableCell
												component='th'
												id={labelId}
												scope='row'
												padding='normal'
												align='left'
											>
												{index + 1 + page * rowsPerPage}
											</TableCell>
											<TableCell
												align='left'
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													cursor: 'pointer',
												}}
												onClick={() => handleViewDetails(row)}
											>
												{row.curriculumName}
											</TableCell>
											<TableCell
												align='left'
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													cursor: 'pointer',
												}}
												onClick={() => handleViewDetails(row)}
											>
												{row.curriculumCode?.length > 0 ? row.curriculumCode : '- - -'}
											</TableCell>
											<TableCell
												align='left'
												className='!font-semibold'
												sx={{ color: GRADE_COLOR[row.grade] }}
											>
												{row.grade > 0
													? CLASSGROUP_STRING_TYPE.find((item) => item.value === row.grade)?.key
													: '- - -'}
											</TableCell>
											<TableCell width={80}>
												<IconButton
													color='error'
													sx={{ zIndex: 10 }}
													onClick={(event) => handleDeleteClick(event, row)}
												>
													<Image
														src='/images/icons/delete.png'
														alt='Xóa tổ bộ môn'
														width={15}
														height={15}
													/>
												</IconButton>
											</TableCell>
										</TableRow>
									);
								})}
								{emptyRows > 0 && (
									<TableRow
										style={{
											height: 50 * emptyRows,
										}}
									>
										<TableCell colSpan={6} />
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component='div'
						labelRowsPerPage='Số hàng'
						labelDisplayedRows={({ from, to, count }) =>
							`${from} - ${to} của ${count !== -1 ? count : `hơn ${to}`}`
						}
						count={totalRows ?? curriculumTableData.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Paper>
			</Box>
			<CreateCurriculumModal
				open={isAddModalOpen}
				setOpen={setIsAddModalOpen}
				subjectGroupMutator={mutate}
			/>
			<DeleteCurriculumModal
				open={isDeleteModalOpen}
				setOpen={setIsDeleteModalOpen}
				subjectGroupName={selectedRow?.curriculumName ?? 'Không xác định'}
				subjectGroupId={selectedRow?.curriculumKey ?? 0}
				mutate={mutate}
			/>
		</div>
	);
};

export default CurriculumTable;
