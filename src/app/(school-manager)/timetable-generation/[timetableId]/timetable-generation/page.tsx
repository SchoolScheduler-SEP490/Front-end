'use client';
import { useAppContext } from '@/context/app_provider';
import {
	ITimetableGenerationState,
	setGeneratedScheduleStored,
	updateTimetableStored,
} from '@/context/slice_timetable_generation';
import useNotify from '@/hooks/useNotify';
import { IScheduleResponse } from '@/utils/constants';
import { firestore } from '@/utils/firebaseConfig';
import { Button, Divider } from '@mui/material';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TimetableLoading from './_components/timetable_loading';
import PreviewScheduleTable from './_components/timetable_table_preview';
import useGenerateTimetable from './_hooks/useGenerateTimetable';
import { IGenerateTimetableRequest } from './_libs/constants';
import { useRouter } from 'next/navigation';

export default function Home() {
	const { schoolId, selectedSchoolYearId, sessionToken } = useAppContext();
	const {
		dataStored,
		timetableFirestoreName,
		timetableStored,
		generatedScheduleFirestorename,
		timetableId,
	}: ITimetableGenerationState = useSelector((state: any) => state.timetableGeneration);
	const dispatch = useDispatch();
	const router = useRouter();

	const [isTimetableGenerating, setIsTimetableGenerating] = useState<boolean>(false);
	const [isTimetableGenerated, setIsTimetableGenerated] = useState<boolean>(false);

	const handleGenerateTimetable = async () => {
		if (dataStored && timetableStored) {
			setIsTimetableGenerating(true);
			const requestBody: IGenerateTimetableRequest = {
				'start-week': timetableStored['applied-week'] ?? 0,
				'end-week': timetableStored['ended-week'] ?? 0,
				'timetable-name': timetableStored['timetable-name'],
				'fixed-periods-para': dataStored['fixed-periods-para'],
				'no-assign-periods-para': dataStored['no-assign-periods-para'],
				'free-timetable-periods-para': dataStored['free-timetable-periods-para'],
				'teacher-assignments': dataStored['teacher-assignments'],
				'class-combinations': dataStored['class-combinations'],
				'required-break-periods': dataStored['required-break-periods'],
				'minimum-days-off': dataStored['minimum-days-off'],
				'term-id': timetableStored['term-id'] ?? 0,
				'days-in-week': dataStored['days-in-week'],
			};
			const data = await useGenerateTimetable({
				formData: requestBody,
				sessionToken,
				schoolId: Number(schoolId),
				schoolYearId: selectedSchoolYearId,
			});
			if (data?.status === 200) {
				where('timetable-id', '==', timetableId);
				const result: IScheduleResponse = { ...data.result, 'timetable-id': timetableId };
				if (result) {
					const q = query(
						collection(firestore, generatedScheduleFirestorename),
						where('timetable-id', '==', timetableId)
					);
					const querySnapshot = await getDocs(q);
					if (!querySnapshot.empty) {
						querySnapshot.forEach(async (existingDoc) => {
							const docRef = doc(
								firestore,
								generatedScheduleFirestorename,
								existingDoc.id
							);
							await setDoc(docRef, result, { merge: true });

							const docRef2 = doc(
								firestore,
								timetableFirestoreName,
								timetableId ?? ''
							);
							await setDoc(
								docRef2,
								{ ...timetableStored, 'generated-schedule-id': existingDoc.id },
								{ merge: true }
							);

							dispatch(
								updateTimetableStored({
									target: 'generated-schedule-id',
									value: existingDoc.id,
								})
							);
						});
					} else {
						const resRef = await addDoc(
							collection(firestore, generatedScheduleFirestorename),
							result
						);
						if (resRef.id) {
							const docRef = doc(
								firestore,
								timetableFirestoreName,
								timetableStored.id ?? ''
							);
							await setDoc(
								docRef,
								{ ...dataStored, 'generated-schedule-id': resRef.id },
								{ merge: true }
							);
							dispatch(
								updateTimetableStored({
									target: 'generated-schedule-id',
									value: resRef.id,
								})
							);
						}
					}
					dispatch(setGeneratedScheduleStored(result));
					setIsTimetableGenerating(false);
					setIsTimetableGenerated(true);
					useNotify({
						type: 'success',
						message: data?.message,
					});
				}
			} else {
				setIsTimetableGenerating(false);
				useNotify({
					type: 'error',
					message: data?.message,
				});
			}
		}
	};

	const handleGoBack = () => {
		router.push('/timetable-management');
	};

	return (
		<div className='w-full h-screen flex flex-col justify-start items-start'>
			<div className='w-full h-fit py-2 flex flex-row justify-center items-center'>
				{isTimetableGenerated ? (
					<Button
						variant='contained'
						onClick={handleGoBack}
						color='success'
						disabled={isTimetableGenerating}
						sx={{
							color: 'white',
							borderRadius: 0,
							boxShadow: 'none',
						}}
					>
						Về trang quản lý
					</Button>
				) : (
					<Button
						variant='contained'
						onClick={handleGenerateTimetable}
						color='inherit'
						disabled={isTimetableGenerating}
						sx={{
							bgcolor: '#175b8e',
							color: 'white',
							borderRadius: 0,
							boxShadow: 'none',
						}}
					>
						Tạo thời khóa biểu
					</Button>
				)}
			</div>
			<Divider variant='middle' sx={{ width: '100%' }} />
			{isTimetableGenerating && <TimetableLoading isComplete={!isTimetableGenerating} />}
			<div className='w-full h-full flex flex-col justify-center items-center'>
				<PreviewScheduleTable />
			</div>
		</div>
	);
}
