import { configureStore } from '@reduxjs/toolkit';
import { adminSlice } from './slice_admin';

export const adminStore = configureStore({
	reducer: {
		admin: adminSlice.reducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AdminState = ReturnType<typeof adminStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AdminDispatch = typeof adminStore.dispatch;
