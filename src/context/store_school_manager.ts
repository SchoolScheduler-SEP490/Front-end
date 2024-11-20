import { configureStore } from '@reduxjs/toolkit';
import { schoolManagerSlice } from './slice_school_manager';
import { timetableGenerationSlice } from './slice_timetable_generation';

export const schoolManagerStore = configureStore({
	reducer: {
		schoolManager: schoolManagerSlice.reducer,
		timetableGeneration: timetableGenerationSlice.reducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type SchoolManagerState = ReturnType<typeof schoolManagerStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type SchoolManagerDispatch = typeof schoolManagerStore.dispatch;
