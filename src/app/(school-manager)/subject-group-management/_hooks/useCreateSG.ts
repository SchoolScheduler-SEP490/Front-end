import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import { mutate } from 'swr';
import { getCreateSubjectGroupApi } from '../_libs/apis';
import { ICreateSubjectGroupRequest } from '../_libs/constants';

interface ICreateSubjectProps {
	schoolId: string;
	sessionToken: string;
	formData: ICreateSubjectGroupRequest[];
}

const useCreateSubjectGroup = async (props: ICreateSubjectProps) => {
	const { schoolId, formData, sessionToken } = props;
	const endpoint = getCreateSubjectGroupApi({ schoolId });
	let response;

	async function createSubject(url: string) {
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
		response = await mutate(endpoint, createSubject(endpoint), {
			revalidate: true,
		});
		useNotify({
			message: TRANSLATOR[response?.message || ''] ?? 'Có lỗi xảy ra',
			type: response?.status === 201 ? 'success' : 'error',
		});
		return response;
	} catch (err: any) {
		useNotify({
			message: TRANSLATOR[err.message ?? ''] ?? 'Có lỗi xảy ra',
			type: 'error',
		});
	}
};

export default useCreateSubjectGroup;
