import { IDataStoreObject } from '@/app/(school-manager)/timetable-management/_libs/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ITimetableGenerationState {
	isModifying: boolean;
	dataStored: IDataStoreObject;
}

interface IUpdateDataStored {
	target: keyof IDataStoreObject;
	value: any;
}

const initialState: ITimetableGenerationState = {
	isModifying: false,
	dataStored: {} as IDataStoreObject,
};

export const timetableGenerationSlice = createSlice({
	name: 'schoolManager',
	initialState,
	reducers: {
		setDataStored: (state, action: PayloadAction<IDataStoreObject>) => {
			state.dataStored = action.payload;
		},
		setModifyingStatus: (state, action: PayloadAction<boolean>) => {
			state.isModifying = action.payload;
		},
		updateDataStored: (state, action: PayloadAction<IUpdateDataStored>) => {
			(state.dataStored as any)[action.payload.target] = action.payload.value;
			state.isModifying = true;
		},
	},
});

export const { setDataStored, setModifyingStatus, updateDataStored } =
	timetableGenerationSlice.actions;
export default timetableGenerationSlice.reducer;
