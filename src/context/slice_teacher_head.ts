import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ITeacherHeadInfo {
  id: number;
  'first-name': string;
  'last-name': string;
  abbreviation: string;
  email: string;
}

export interface ITeacherHeadState {
  isMenuOpen: boolean;
  teacherHeadInfo: ITeacherHeadInfo | null;
}

const initialState: ITeacherHeadState = {
  isMenuOpen: false,
  teacherHeadInfo: null,
};

export const teacherHeadSlice = createSlice({
  name: 'teacherDepartmentHead',
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    setMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMenuOpen = action.payload;
    },
    setTeacherHeadInfo: (state, action: PayloadAction<ITeacherHeadInfo>) => {
      state.teacherHeadInfo = action.payload;
    },
  },
});

export const { toggleMenu, setMenuOpen, setTeacherHeadInfo } = teacherHeadSlice.actions;
export default teacherHeadSlice.reducer;