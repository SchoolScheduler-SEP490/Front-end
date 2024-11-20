import { useDispatch, useSelector, useStore } from 'react-redux';
import type {
	schoolManagerStore,
	SchoolManagerDispatch,
	SchoolManagerState,
} from '@/context/store_school_manager';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useSMDispatch = useDispatch.withTypes<SchoolManagerDispatch>();
export const usSMSelector = useSelector.withTypes<SchoolManagerState>();
export const usSMStore = useStore.withTypes<typeof schoolManagerStore>();
