import { useDispatch, useSelector, useStore } from 'react-redux';
import type {
	schoolManagerStore,
	SchoolManagerDispatch,
	SchoolManagerState,
} from '@/context/store_school_manager';
import { AdminDispatch, AdminState, adminStore } from '@/context/store_admin';
import { TeacherDispatch, TeacherState, teacherStore } from '@/context/store_teacher';

// Use throughout your app instead of plain `useDispatch` and `useSelector` for School Manager flow
export const useSMDispatch = useDispatch.withTypes<SchoolManagerDispatch>();
export const useSMSelector = useSelector.withTypes<SchoolManagerState>();
export const useSMStore = useStore.withTypes<typeof schoolManagerStore>();

// Use throughout your app instead of plain `useDispatch` and `useSelector` for Admin flow
export const useAdminDispatch = useDispatch.withTypes<AdminDispatch>();
export const useAdminSelector = useSelector.withTypes<AdminState>();
export const useAdminStore = useStore.withTypes<typeof adminStore>();


export const useTeacherDispatch = useDispatch.withTypes<TeacherDispatch>();
export const useTeacherSelector = useSelector.withTypes<TeacherState>();
export const useTeacherStore = useStore.withTypes<typeof teacherStore>();