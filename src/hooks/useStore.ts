import { useDispatch, useSelector, useStore } from 'react-redux';
import type { store, AppDispatch, RootState } from '@/context/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useRootDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<typeof store>();
