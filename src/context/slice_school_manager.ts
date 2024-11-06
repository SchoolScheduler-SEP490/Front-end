import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SchoolManagerState {
	isMenuOpen: boolean;
	selectedSchoolYear: number;
}

const initialState: SchoolManagerState = {
	isMenuOpen: false,
	selectedSchoolYear: 0,
};

export const schoolManagerSlice = createSlice({
	name: 'schoolManager',
	initialState,
	reducers: {
		toggleMenu: (state) => {
			state.isMenuOpen = !state.isMenuOpen;
		},
		setMenuOpen: (state, action: PayloadAction<boolean>) => {
			state.isMenuOpen = action.payload;
		},
		setSelectedSchoolYear: (state, action: PayloadAction<number>) => {
			state.selectedSchoolYear = action.payload;
		},
	},
});

export const { toggleMenu, setMenuOpen } = schoolManagerSlice.actions;
export default schoolManagerSlice.reducer;
