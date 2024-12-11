import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ITeacherInfo {
  id: number;
  'first-name': string;
  'last-name': string;
  abbreviation: string;
  email: string;
}

export interface ITeacherState {
  isMenuOpen: boolean;
  teacherInfo: ITeacherInfo | null;
}

const initialState: ITeacherState = {
  isMenuOpen: false,
  teacherInfo: null,
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
    setTeacherInfo: (state, action: PayloadAction<ITeacherInfo>) => {
      state.teacherInfo = action.payload;
    },
  },
});

export const { toggleMenu, setMenuOpen, setTeacherInfo } = teacherSlice.actions;
export default teacherSlice.reducer;
