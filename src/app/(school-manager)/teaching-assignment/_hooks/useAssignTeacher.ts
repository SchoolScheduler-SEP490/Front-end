import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import { mutate } from 'swr';
import { ITeacherAssignmentRequest } from '../_libs/constants';
import { getAssignTeacherApi } from '../_libs/apis';

interface IUpdateSubjectProps {
	sessionToken: string;
	formData: ITeacherAssignmentRequest;
}

const useAssignTeacher = async (props: IUpdateSubjectProps) => {
	const { formData, sessionToken } = props;
	const endpoint = getAssignTeacherApi();
	let response;

	async function assignTeacher(url: string) {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(formData),
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message);
		}
		return data;
	}

	try {
		// Sử dụng mutate với POST request
		response = await mutate(endpoint, assignTeacher(endpoint), {
			revalidate: true,
		});
		useNotify({
			message: TRANSLATOR[response?.message || ''] ?? 'Có lỗi xảy ra',
			type: response?.status === 200 ? 'success' : 'error',
		});
		return response;
	} catch (err: any) {
		useNotify({
			message: TRANSLATOR[err.message ?? ''] ?? 'Có lỗi xảy ra',
			type: 'error',
		});
	}
};

export default useAssignTeacher;
