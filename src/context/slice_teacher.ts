import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ITeacherState {
	isMenuOpen: boolean;
}

const initialState: ITeacherState = {
	isMenuOpen: false,
};

export const teacherSlice = createSlice({
	name: 'teacher',
	initialState,
	reducers: {
		toggleMenu: (state) => {
			state.isMenuOpen = !state.isMenuOpen;
		},
		setMenuOpen: (state, action: PayloadAction<boolean>) => {
			state.isMenuOpen = action.payload;
		},
	},
});

export const { toggleMenu, setMenuOpen } = teacherSlice.actions;
export default teacherSlice.reducer;
