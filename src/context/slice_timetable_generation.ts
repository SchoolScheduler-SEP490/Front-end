import {
	IConfigurationStoreObject,
	ITimetableStoreObject,
} from '@/app/(school-manager)/timetable-generation/_libs/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ITimetableGenerationState {
	timetableId: string;
	dataFirestoreName: string;
	timetableFirestoreName: string;
	isModifying: boolean;
	dataStored: IConfigurationStoreObject;
	timetableStored: ITimetableStoreObject;
}

interface IUpdateDataStored {
	target: keyof IConfigurationStoreObject;
	value: any;
}

const initialState: ITimetableGenerationState = {
	timetableId: '',
	dataFirestoreName: 'configurations',
	timetableFirestoreName: 'timetables',
	isModifying: false,
	dataStored: {} as IConfigurationStoreObject,
	timetableStored: {} as ITimetableStoreObject,
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
		setModifyingStatus: (state, action: PayloadAction<boolean>) => {
			state.isModifying = action.payload;
		},
		updateDataStored: (state, action: PayloadAction<IUpdateDataStored>) => {
			(state.dataStored as any)[action.payload.target] = action.payload.value;
			state.isModifying = true;
		},
		setTimetableId: (state, action: PayloadAction<string>) => {
			state.timetableId = action.payload;
		},
	},
});

export const {
	setDataStored,
	setTimetableStored,
	setModifyingStatus,
	updateDataStored,
	setTimetableId,
} = timetableGenerationSlice.actions;
export default timetableGenerationSlice.reducer;
