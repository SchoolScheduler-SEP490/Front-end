'use client';
import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import {
	REQUEST_TYPE_TRANSLATOR as REQUEST_TYPE,
	REQUEST_TYPE_TRANSLATOR,
} from '@/utils/constants';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
	Card,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Theme
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { IDropdownOption } from '../_utils/contants';
import RequestDetailsModal from './_components/request_modal_details';
import useFetchRequests from './_hooks/useFetchRequests';
import { IRequestResponse, REQUEST_STATUS_TRANSLATOR as REQUEST_STATUS } from './_libs/constants';

function formatDateString(dateString: string): string {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
			scrollbars: 'none',
		},
	},
};
function getStyles(
	selected: IDropdownOption<string>,
	personName: IDropdownOption<string>[],
	theme: Theme
) {
	return {
		fontWeight: personName.includes(selected)
			? theme.typography.fontWeightMedium
			: theme.typography.fontWeightRegular,
	};
}

const REQUEST_STATUS_COLOR: { [key: string]: { text: string; bg: string } } = {
	Pending: { text: 'tertiary-normal', bg: 'tertiary-light-hover' },
	Approved: { text: 'basic-positive', bg: 'basic-positive-hover' },
	Rejected: { text: 'basic-negative', bg: 'basic-negative-hover' },
};

export default function Home() {
	const { selectedSchoolYearId, sessionToken } = useAppContext();

	const [selectedStatus, setSelectedStatus] = useState<'Pending' | 'Approved' | 'Rejected'>(
		'Pending'
	);
	const [selectedRequestType, setSelectedRequestType] = useState<
		'All' | 'RequestChangeSlot' | 'RequestAbsenntSchedule' | 'Other'
	>('All');
	const [requestData, setRequestData] = useState<IRequestResponse[]>([]);
	const [selectedRequest, setSelectedRequest] = useState<IRequestResponse | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

	const {
		data: requestResponse,
		mutate: updateRequestResponse,
		isValidating: isRequestValidating,
	} = useFetchRequests({
		sessionToken,
		schoolYearId: selectedSchoolYearId,
		status: selectedStatus,
	});

	useEffect(() => {
		updateRequestResponse();
		if (requestResponse?.status === 200) {
			setRequestData(requestResponse.result.items);
		}
	}, [requestResponse, selectedStatus]);

	const sortedRequestData: IRequestResponse[] = useMemo((): IRequestResponse[] => {
		return requestData
			? requestData
					.filter(
						(request) =>
							selectedRequestType === 'All' || request['request-type'] === selectedRequestType
					)
					.sort(
						(a, b) => new Date(a['create-date']).getTime() - new Date(b['create-date']).getTime()
					)
			: [];
	}, [requestData, selectedRequestType]);

	const handleSelectRequest = (request: IRequestResponse) => {
		setSelectedRequest(request);
		setIsDetailModalOpen(true);
	};

	return (
		<div className='w-[84%] h-screen flex flex-col justify-between items-start '>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-medium tracking-wider'>Đơn yêu cầu</h3>
				</div>
			</SMHeader>
			<div className='w-full h-[95vh] flex flex-col justify-center items-center gap-2'>
				<div
					id='teacher-selector'
					className='w-full h-[10vh] flex flex-row justify-start items-center gap-5 px-5 pt-2'
				>
					<FormControl sx={{ width: '20%' }}>
						<InputLabel id='teacher-selector-label' variant='standard'>
							Chọn trạng thái đơn
						</InputLabel>
						<Select
							labelId='teacher-selector-label'
							id='teacher-selector-select'
							variant='standard'
							value={selectedStatus}
							onChange={(e) =>
								setSelectedStatus(e.target.value as 'Pending' | 'Approved' | 'Rejected')
							}
							MenuProps={MenuProps}
							sx={{ width: '100%' }}
							renderValue={(selected) => {
								return REQUEST_STATUS[selected];
							}}
						>
							{Object.keys(REQUEST_STATUS).map((option: string, index: number) => (
								<MenuItem key={option + index} value={option}>
									{REQUEST_STATUS[option]}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl sx={{ width: '20%' }}>
						<InputLabel id='teacher-selector-label' variant='standard'>
							Chọn loại đơn
						</InputLabel>
						<Select
							labelId='teacher-selector-label'
							id='teacher-selector-select'
							variant='standard'
							value={selectedRequestType}
							onChange={(e) =>
								setSelectedRequestType(
									e.target.value as 'All' | 'RequestChangeSlot' | 'RequestAbsenntSchedule' | 'Other'
								)
							}
							MenuProps={MenuProps}
							sx={{ width: '100%', maxWidth: '20vw' }}
							renderValue={(selected) => REQUEST_TYPE[selected]}
						>
							{Object.keys(REQUEST_TYPE).map((option: string, index: number) => (
								<MenuItem key={option + index} value={option}>
									{REQUEST_TYPE[option]}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className='w-full h-full max-h-[85vh] flex gap-[2%] flex-wrap px-5 py-2 overflow-y-scroll no-scrollbar'>
					{sortedRequestData.map((request: IRequestResponse, index: number) => (
						<Card
							sx={{
								width: '32%',
								height: '30%',
								cursor: 'pointer',
								p: 2,
								m: 0,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								gap: 1,
								'&:hover': {
									boxShadow: 6,
								},
							}}
							onClick={() => handleSelectRequest(request)}
							key={request.id}
						>
							<div className='w-full h-fit flex flex-row justify-between items-center'>
								<h1 className='w-max overflow-hidden font-medium text-ellipsis whitespace-nowrap'>
									{REQUEST_TYPE_TRANSLATOR[request['request-type']].toUpperCase()}
								</h1>
								<div
									className={`bg-${
										REQUEST_STATUS_COLOR[request.status].bg
									} w-fit h-fit rounded-md px-2 py-1`}
								>
									<p
										className={`text-body-medium-strong font-normal text-${
											REQUEST_STATUS_COLOR[request.status].text
										}`}
									>
										{REQUEST_STATUS[request.status]}
									</p>
								</div>
							</div>
							<p className='line-clamp-2 text-justify text-body-medium font-normal'>
								<span className='w-fit min-w-[20%] fh-fit opacity-70'>Nội dung: </span>
								{request['request-description']}
							</p>
							<div
								className='line-clamp-2 text-justify text-body-medium font-normal flex flex-row justify-start items-center gap-1'
								onClick={(event) => event.stopPropagation()}
							>
								<span className='w-fit min-w-[20%] fh-fit opacity-70'>Tệp đính kèm: </span>
								{request['attached-file'] === null ? (
									'Không'
								) : (
									<a
										href={request['attached-file']}
										target='_blank'
										rel='noopener noreferrer'
										className='w-fit h-fit flex flex-row justify-start items-center gap-1 text-primary-300'
									>
										<AttachFileIcon sx={{ fontSize: 15 }} />
										<span style={{ textDecoration: 'underline' }}>Tải xuống</span>
									</a>
								)}
							</div>
							<div className='w-full h-fit flex flex-row justify-between items-center'>
								<p className='text-body-medium-strong font-medium'>{`${request['teacher-first-name']} ${request['teacher-last-name']}`}</p>
								<p className='text-body-medium font-medium'>
									<span className='w-fit min-w-[20%] fh-fit opacity-70 font-normal'>
										Ngày tạo:{' '}
									</span>
									{formatDateString(request['create-date'])}
								</p>
							</div>
						</Card>
					))}
				</div>
				<RequestDetailsModal
					open={isDetailModalOpen}
					setOpen={setIsDetailModalOpen}
					selectedReqeust={selectedRequest}
					updateData={updateRequestResponse}
				/>
			</div>
		</div>
	);
}
