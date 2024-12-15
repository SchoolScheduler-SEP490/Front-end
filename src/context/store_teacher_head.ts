import { configureStore } from "@reduxjs/toolkit";
import { teacherHeadSlice } from "./slice_teacher_head";

export const teacherHeadStore = configureStore({
  reducer: {
    teacherDepartmentHead: teacherHeadSlice.reducer,
  },
});

export type TeacherHeadState = ReturnType<typeof teacherHeadStore.getState>;
export type TeacherHeadDispatch = typeof teacherHeadStore.dispatch;
