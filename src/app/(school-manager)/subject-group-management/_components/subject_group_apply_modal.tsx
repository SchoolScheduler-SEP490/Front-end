import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import useFilterArray from '@/hooks/useFilterArray';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Box,
	Checkbox,
	Collapse,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Modal,
	styled,
	Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import useFetchSGClass from '../_hooks/useFetchClass';
import {
	IApplySubjectGroupRequest,
	ISGClassResponse,
	IVulnerableClass,
} from '../_libs/constants';
import ApllyConfirmationModal from './subject_group_confirm_modal';
import useApplySubjectGroup from '../_hooks/useApplySG';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

const Div = styled('div')(({ theme }) => ({
	...theme.typography.button,
	backgroundColor: theme.palette.background.paper,
	padding: theme.spacing(1),
}));

interface ISGApplyModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	schoolYearId: number;
	grade: string;
	subjectGroupName: string;
	subjectGroupId: number;
}

interface RenderUnselectedItemOptions {
	item: ISGClassResponse;
	handleMouseDown: (row: ISGClassResponse) => void;
	handleMouseEnter: (row: ISGClassResponse) => void;
	isSelected: boolean;
}

function renderUnselectedItem({
	item,
	handleMouseDown,
	handleMouseEnter,
	isSelected,
}: RenderUnselectedItemOptions) {
	return (
		<ListItem
			onMouseDown={() => handleMouseDown(item)}
			onMouseEnter={() => handleMouseEnter(item)}
			sx={[
				{ cursor: 'pointer', userSelect: 'none' },
				isSelected && { bgcolor: 'action.selected' },
			]}
		>
			<Checkbox checked={isSelected} />
			<ListItemText primary={item.name} />
			<p className='text-body-small italic opacity-60'>
				{item['subject-group-id'] === null
					? 'Chưa áp dụng Tổ hợp'
					: item['subject-group-name']}
			</p>
		</ListItem>
	);
}

interface RenderSelectedItemOptions {
	item: ISGClassResponse;
	handleRemoveItem: (item: ISGClassResponse) => void;
}

function renderSelectedItem({ item, handleRemoveItem }: RenderSelectedItemOptions) {
	return (
		<ListItem
			secondaryAction={
				<IconButton
					edge='end'
					aria-label='delete'
					color='error'
					title='Delete'
					onClick={() => handleRemoveItem(item)}
				>
					<DeleteIcon />
				</IconButton>
			}
			sx={[
				{ cursor: 'pointer', userSelect: 'none' },
				item['subject-group-id'] !== null && { bgcolor: '#fff0eb' },
			]}
		>
			<Checkbox checked />
			<ListItemText primary={item.name} />
			<p className='text-body-small italic opacity-60'>
				{item['subject-group-id'] === null
					? 'Chưa áp dụng Tổ hợp'
					: item['subject-group-name']}
			</p>
		</ListItem>
	);
}

const ApplySubjectGroupModal = (props: ISGApplyModalProps) => {
	const { open, setOpen, schoolYearId, grade, subjectGroupName, subjectGroupId } =
		props;
	const { schoolId, sessionToken } = useAppContext();
	const { data, isValidating, error, mutate } = useFetchSGClass({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
		schoolYearId,
		grade,
	});

	const [classOptions, setClassOptions] = useState<ISGClassResponse[]>([]);
	const [selectedClasses, setSelectedClasses] = useState<ISGClassResponse[]>([]);
	const [tmpSelectedClasses, setTmpSelectedClasses] = useState<ISGClassResponse[]>([]);
	const [vulnerableClasses, setVulnerableClasses] = useState<IVulnerableClass[]>([]);
	const [isSelecting, setIsSelecting] = useState<boolean>(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

	useEffect(() => {
		mutate();
		if (data?.status === 200) {
			var sgAvailableClasses: ISGClassResponse[] = [];
			var sgExistedClasses: ISGClassResponse[] = [];
			data.result.items.map((item: ISGClassResponse) => {
				if (item['subject-group-id'] === null) {
					sgAvailableClasses.push(item);
				} else {
					sgExistedClasses.push(item);
				}
			});
			setClassOptions([...sgAvailableClasses, ...sgExistedClasses]);
		}
	}, [data]);

	const handleClose = () => {
		setOpen(false);
		setIsSelecting(false);
		setSelectedClasses([]);
		setTmpSelectedClasses([]);
	};

	const handleAddClass = () => {
		if (tmpSelectedClasses.length > 0) {
			setSelectedClasses((prev: ISGClassResponse[]) => [
				...prev,
				...tmpSelectedClasses,
			]);
			setClassOptions((prev: ISGClassResponse[]) =>
				prev.filter((item) => !tmpSelectedClasses.includes(item))
			);
			``;
			setTmpSelectedClasses([]);
		}
	};

	const handleRemoveClass = (item: ISGClassResponse) => {
		setSelectedClasses((prev: ISGClassResponse[]) =>
			prev.filter((selectedItem) => selectedItem !== item)
		);
		setClassOptions((prev: ISGClassResponse[]) =>
			useFilterArray([...prev, item], 'name').sort((a, b) =>
				a.name.localeCompare(b.name)
			)
		);
	};

	const handleMouseDown = (row: ISGClassResponse) => {
		setIsSelecting(true);
		const updatedSelectedRows = new Set<ISGClassResponse>(tmpSelectedClasses);
		if (updatedSelectedRows.has(row)) {
			updatedSelectedRows.delete(row);
		} else {
			updatedSelectedRows.add(row);
		}
		setTmpSelectedClasses(Array.from(updatedSelectedRows));
	};
	const handleMouseUp = () => {
		setIsSelecting(false);
	};
	const handleMouseEnter = (row: ISGClassResponse) => {
		if (isSelecting) {
			const updatedSelectedRows = new Set(tmpSelectedClasses);
			if (updatedSelectedRows.has(row)) {
				updatedSelectedRows.delete(row);
			} else {
				updatedSelectedRows.add(row);
			}
			setTmpSelectedClasses(Array.from(updatedSelectedRows));
		}
	};

	const handleUpdateSubmit = async () => {
		await useApplySubjectGroup({
			formData: {
				'class-ids': selectedClasses.map((item) => item.id),
				'subject-group-id': subjectGroupId,
			} as IApplySubjectGroupRequest,
			sessionToken: sessionToken,
		});
		handleClose();
		setIsConfirmOpen(false);
	};

	const handleConfirmApply = () => {
		if (selectedClasses.length > 0) {
			var tmpVulClasses: IVulnerableClass[] = [];
			selectedClasses.map((item) => {
				if (item['subject-group-id'] !== null) {
					tmpVulClasses.push({
						className: item.name,
						existingGroupName: item['subject-group-name'],
					});
				}
			});
			setVulnerableClasses(tmpVulClasses);
		}
		setIsConfirmOpen(true);
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='keep-mounted-modal-title'
			aria-describedby='keep-mounted-modal-description'
		>
			<Box sx={style}>
				<div
					id='modal-header'
					className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3 py-2'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-medium-strong font-normal opacity-60'
					>
						Áp dụng Tổ hợp môn
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='p-3 w-full h-[60vh] flex flex-col justify-start items-center overflow-y-scroll no-scrollbar'>
					<div>
						<div className='relative !w-[38vw] flex flex-col justify-center items-center'>
							<Div>Danh sách lớp đã chọn</Div>
							{selectedClasses.length === 0 && (
								<h2 className='italic text-body-small opacity-70'>
									Chưa có lớp nào được chọn
								</h2>
							)}
						</div>
						<List>
							<TransitionGroup className='flex flex-col justify-start items-center'>
								{selectedClasses.map((item, index) => (
									<Collapse key={index} sx={{ width: '70%' }}>
										{renderSelectedItem({
											item,
											handleRemoveItem: handleRemoveClass,
										})}
									</Collapse>
								))}
							</TransitionGroup>
						</List>
					</div>
					<div className='w-full h-[1px] px-5 bg-basic-gray-active my-3' />
					<div>
						<div className='relative !w-[38vw] flex flex-col justify-center items-center'>
							<Div>Danh sách lớp có thể áp dụng</Div>
							{classOptions.length === 0 && (
								<h2 className='italic text-body-small opacity-70'>
									Không có lớp áp dụng phù hợp
								</h2>
							)}
							<ContainedButton
								title='Thêm'
								styles='!py-1 absolute right-0 top-[50%] translate-y-[-50%] '
								onClick={handleAddClass}
							/>
						</div>
						<List>
							<TransitionGroup className='flex flex-col justify-start items-center'>
								{classOptions.map((item, index) => (
									<Collapse
										key={index}
										sx={{ width: '60%' }}
										onMouseUp={handleMouseUp}
									>
										{renderUnselectedItem({
											item,
											handleMouseDown,
											handleMouseEnter,
											isSelected: tmpSelectedClasses.includes(item),
										})}
									</Collapse>
								))}
							</TransitionGroup>
						</List>
					</div>
				</div>
				<div
					id='modal-footer'
					className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'
				>
					<ContainedButton
						title='áp dụng'
						disableRipple
						type='button'
						disabled={selectedClasses.length === 0}
						styles='bg-primary-300 text-white !py-1 px-4'
						onClick={handleConfirmApply}
					/>
					<ContainedButton
						title='Huỷ'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
					/>
				</div>
				<ApllyConfirmationModal
					open={isConfirmOpen}
					setOpen={setIsConfirmOpen}
					vulnerableClasses={vulnerableClasses}
					newSubjectGroup={subjectGroupName}
					handleConfirm={handleUpdateSubmit}
				/>
			</Box>
		</Modal>
	);
};

export default ApplySubjectGroupModal;
