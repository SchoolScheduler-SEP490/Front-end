import { configureStore } from "@reduxjs/toolkit";
import { teacherSlice } from "./slice_teacher";

export const teacherStore = configureStore({
  reducer: {
    teacher: teacherSlice.reducer, 
  },
});

export type TeacherState = ReturnType<typeof teacherStore.getState>;
export type TeacherDispatch = typeof teacherStore.dispatch;
