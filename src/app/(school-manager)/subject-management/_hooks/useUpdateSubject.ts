import { mutate } from 'swr';
import { IUpdateSubjectRequestBody } from '../_libs/constants';
import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import { getUpdateSubjectApi } from '../_libs/apis';

interface ICreateSubjectProps {
	subjectId: number;
	sessionToken: string;
	formData: IUpdateSubjectRequestBody;
}

const useUpdateSubject = async (props: ICreateSubjectProps) => {
	const { subjectId, formData, sessionToken } = props;
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	let response;

	async function updateSubject(url: string) {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
				'Content-Type': 'application/json',
			},
			method: 'PUT',
			body: JSON.stringify({
				...formData,
				'total-slot-in-year': 0,
				'slot-specialized': 0,
			}),
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message);
		}
		return data;
	}

	try {
		// Sử dụng mutate với POST request
		const endpoint = getUpdateSubjectApi({ subjectId });
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

export default useUpdateSubject;
