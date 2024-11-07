import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SchoolManagerState {
	isMenuOpen: boolean;
}

const initialState: SchoolManagerState = {
	isMenuOpen: false,
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
	},
});

export const { toggleMenu, setMenuOpen } = schoolManagerSlice.actions;
export default schoolManagerSlice.reducer;
