import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IAdminState {
	isMenuOpen: boolean;
}

const initialState: IAdminState = {
	isMenuOpen: false,
};

export const adminSlice = createSlice({
	name: 'admin',
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

export const { toggleMenu, setMenuOpen } = adminSlice.actions;
export default adminSlice.reducer;
