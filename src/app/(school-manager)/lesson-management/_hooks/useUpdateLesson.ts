import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import { mutate } from 'swr';
import { getUpdateLessonApi } from '../_libs/apis';
import { IUpdateSubjectInGroupRequest } from '../_libs/constants';

interface IUpdateSubjectProps {
	sessionToken: string;
	formData: IUpdateSubjectInGroupRequest[];
}

const useUpdateLesson = async (props: IUpdateSubjectProps) => {
	const { formData, sessionToken } = props;
	const endpoint = getUpdateLessonApi();
	let response;

	async function updateSubject(url: string) {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
				'Content-Type': 'application/json',
			},
			method: 'PATCH',
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
		response = await mutate(endpoint, updateSubject(endpoint), {
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

export default useUpdateLesson;
