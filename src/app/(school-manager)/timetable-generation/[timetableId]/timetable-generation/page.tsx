'use client';
import { useAppContext } from '@/context/app_provider';
import {
	ITimetableGenerationState,
	setGeneratedScheduleStored,
	setGeneratingStatus,
	updateTimetableStored,
} from '@/context/slice_timetable_generation';
import useNotify from '@/hooks/useNotify';
import { IScheduleResponse, ITimetableStoreObject } from '@/utils/constants';
import { firestore } from '@/utils/firebaseConfig';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TimetableLoading from './_components/timetable_loading';
import PreviewScheduleTable from './_components/timetable_table_preview';
import useGenerateTimetable from './_hooks/useGenerateTimetable';
import { IGenerateTimetableRequest } from './_libs/constants';

export default function Home() {
	const { schoolId, selectedSchoolYearId, sessionToken } = useAppContext();
	const {
		dataStored,
		timetableFirestoreName,
		timetableStored,
		generatedScheduleFirestorename,
		timetableId,
		isTimetableGenerating,
	}: ITimetableGenerationState = useSelector((state: any) => state.timetableGeneration);
	const dispatch = useDispatch();

	const handleGenerateTimetable = async () => {
		if (dataStored && timetableStored) {
			dispatch(setGeneratingStatus(true));
			const requestBody: IGenerateTimetableRequest = {
				'start-week': timetableStored['applied-week'] ?? 0,
				'end-week': timetableStored['ended-week'] ?? 0,
				'timetable-name': timetableStored['timetable-name'],
				'fixed-periods-para': dataStored['fixed-periods-para'].map((item) => ({
					'class-id': item['class-id'],
					'start-at': item['start-at'],
					'subject-id': item['subject-id'],
				})),
				'no-assign-periods-para': dataStored['no-assign-periods-para'],
				'free-timetable-periods-para': dataStored['free-timetable-periods-para'],
				'teacher-assignments': dataStored['teacher-assignments'],
				'required-break-periods': dataStored['required-break-periods'],
				'minimum-days-off': dataStored['minimum-days-off'],
				'term-id': timetableStored['term-id'] ?? 0,
				'days-in-week': dataStored['days-in-week'],
				'max-execution-time-in-seconds': dataStored['max-execution-time-in-seconds'],
			};
			const data = await useGenerateTimetable({
				formData: requestBody,
				sessionToken,
				schoolId: Number(schoolId),
				schoolYearId: selectedSchoolYearId,
			});
			if (data?.status === 200) {
				const result: IScheduleResponse = { ...data.result, 'timetable-id': timetableId };
				if (result) {
					const timetableQuery = query(
						collection(firestore, generatedScheduleFirestorename),
						where('timetable-id', '==', timetableId)
					);
					const querySnapshot = await getDocs(timetableQuery);
					if (!querySnapshot.empty) {
						// Update record đã tồn tại
						querySnapshot.forEach(async (existingDoc) => {
							const docRef = doc(firestore, generatedScheduleFirestorename, existingDoc.id);
							await setDoc(docRef, result, { merge: true });

							const docRef2 = doc(firestore, timetableFirestoreName, timetableId ?? '');
							await setDoc(
								docRef2,
								{
									...timetableStored,
									'generated-schedule-id': existingDoc.id,
									'generated-date': result['create-date'],
									'fitness-point': result['fitness-point'],
									'time-cost': result['excute-time'],
								} as ITimetableStoreObject,
								{ merge: true }
							).then(() => {
								dispatch(
									setGeneratingStatus(false),
									setGeneratedScheduleStored({ ...result }),
									updateTimetableStored({
										target: 'generated-schedule-id',
										value: existingDoc.id,
									})
								);
								useNotify({
									type: 'success',
									message: data?.message,
								});
							});
						});
					} else {
						try {
							// Tạo record mới nếu chưa có
							const resRef = await addDoc(
								collection(firestore, generatedScheduleFirestorename),
								result
							);

							if (resRef.id) {
								const timetableDocRef = doc(
									firestore,
									timetableFirestoreName,
									timetableId ?? 'Unknown'
								);
								await setDoc(
									timetableDocRef,
									{
										...timetableStored,
										'generated-schedule-id': resRef.id,
										'generated-date': result['create-date'],
										'fitness-point': result['fitness-point'],
										'time-cost': result['excute-time'],
									} as ITimetableStoreObject,
									{ merge: true }
								).then(() => {
									// Dispatch từng hành động một cách riêng biệt
									dispatch(
										setGeneratingStatus(false),
										setGeneratedScheduleStored(result),
										updateTimetableStored({
											target: 'generated-schedule-id',
											value: resRef.id,
										})
									);
									useNotify({
										type: 'success',
										message: data?.message,
									});
								});
							}
						} catch (error: any) {
							console.error('Error while adding or updating document:', error);
							useNotify({
								type: 'error',
								message: 'Đã có lỗi xảy ra trong quá trình lưu dữ liệu.',
							});
						} finally {
							// Đảm bảo trạng thái được đặt lại sau khi kết thúc xử lý
							dispatch(setGeneratingStatus(false));
						}
					}
				}
			} else {
				dispatch(setGeneratingStatus(false));
				useNotify({
					type: 'error',
					message: data?.Message,
				});
			}
		}
	};

	return (
		<div className='w-full h-screen flex flex-col justify-start items-start'>
			{isTimetableGenerating && <TimetableLoading isComplete={!isTimetableGenerating} />}
			<div className='w-full h-[100vh] flex flex-col justify-center items-center'>
				<PreviewScheduleTable
					isTimetableGenerating={isTimetableGenerating}
					handleGenerateTimetable={handleGenerateTimetable}
				/>
			</div>
		</div>
	);
}
