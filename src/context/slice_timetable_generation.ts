import { IConfigurationStoreObject } from '@/app/(school-manager)/timetable-generation/_libs/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ITimetableGenerationState {
	timetableId: string;
	fireStoreName: string;
	isModifying: boolean;
	dataStored: IConfigurationStoreObject;
}

interface IUpdateDataStored {
	target: keyof IConfigurationStoreObject;
	value: any;
}

const initialState: ITimetableGenerationState = {
	timetableId: '',
	fireStoreName: 'configurations',
	isModifying: false,
	dataStored: {} as IConfigurationStoreObject,
};

export const timetableGenerationSlice = createSlice({
	name: 'schoolManager',
	initialState,
	reducers: {
		setDataStored: (state, action: PayloadAction<IConfigurationStoreObject>) => {
			state.dataStored = action.payload;
		},
		setModifyingStatus: (state, action: PayloadAction<boolean>) => {
			state.isModifying = action.payload;
		},
		updateDataStored: (state, action: PayloadAction<IUpdateDataStored>) => {
			(state.dataStored as any)[action.payload.target] = action.payload.value;
			state.isModifying = true;
		},
		updateFireStoreName: (state, action: PayloadAction<string>) => {
			state.fireStoreName = action.payload;
		},
		setTimetableId: (state, action: PayloadAction<string>) => {
			state.timetableId = action.payload;
		},
	},
});

export const {
	setDataStored,
	setModifyingStatus,
	updateDataStored,
	updateFireStoreName,
	setTimetableId,
} = timetableGenerationSlice.actions;
export default timetableGenerationSlice.reducer;
