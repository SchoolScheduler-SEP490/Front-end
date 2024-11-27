import {
	IConfigurationStoreObject,
	IScheduleResponse,
	ITimetableStoreObject,
} from '@/utils/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ITimetableGenerationState {
	timetableId: string;
	dataFirestoreName: string;
	timetableFirestoreName: string;
	generatedScheduleFirestorename: string;
	isModifying: boolean;
	dataStored: IConfigurationStoreObject;
	timetableStored: ITimetableStoreObject;
	generatedScheduleStored: IScheduleResponse;
}

interface IUpdateDataStored {
	target: keyof IConfigurationStoreObject;
	value: any;
}

interface IUpdateTimetableStored {
	target: keyof ITimetableStoreObject;
	value: any;
}

const initialState: ITimetableGenerationState = {
	timetableId: '',
	dataFirestoreName: 'configurations',
	timetableFirestoreName: 'timetables',
	generatedScheduleFirestorename: 'schedule-responses',
	isModifying: false,
	dataStored: {} as IConfigurationStoreObject,
	timetableStored: {} as ITimetableStoreObject,
	generatedScheduleStored: {} as IScheduleResponse,
};

export const timetableGenerationSlice = createSlice({
	name: 'schoolManager',
	initialState,
	reducers: {
		setDataStored: (state, action: PayloadAction<IConfigurationStoreObject>) => {
			state.dataStored = action.payload;
		},
		setTimetableStored: (state, action: PayloadAction<ITimetableStoreObject>) => {
			state.timetableStored = action.payload;
		},
		setGeneratedScheduleStored: (state, action: PayloadAction<IScheduleResponse>) => {
			state.generatedScheduleStored = action.payload;
		},
		setModifyingStatus: (state, action: PayloadAction<boolean>) => {
			state.isModifying = action.payload;
		},
		updateDataStored: (state, action: PayloadAction<IUpdateDataStored>) => {
			(state.dataStored as any)[action.payload.target] = action.payload.value;
			state.isModifying = true;
		},
		updateTimetableStored: (state, action: PayloadAction<IUpdateTimetableStored>) => {
			(state.dataStored as any)[action.payload.target] = action.payload.value;
			state.isModifying = true;
		},
		setTimetableId: (state, action: PayloadAction<string>) => {
			state.timetableId = action.payload;
		},
	},
});

export const {
	// Data initialization
	setDataStored,
	setTimetableStored,
	setModifyingStatus,
	setGeneratedScheduleStored,

	// Action with payload
	updateDataStored,
	updateTimetableStored,
	setTimetableId,
} = timetableGenerationSlice.actions;
export default timetableGenerationSlice.reducer;
